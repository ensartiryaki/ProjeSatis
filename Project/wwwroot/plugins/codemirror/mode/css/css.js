// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("css", function(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested,
      lineComment = parserConfig.lineComment,
      supportsAtComponent = parserConfig.supportsAtComponent === true,
      highlightNonStandardPropertyKeywords = config.highlightNonStandardPropertyKeywords !== false;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]*/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if (stream.match(/^[\w-.]+(?=\()/)) {
      if (/^(url(-prefix)?|domain|regexp)$/i.test(stream.current())) {
        state.tokenize = tokenParenthesized;
      }
      return ret("variable callee", "variable");
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "word");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/^\s*[\"\')]/, false))
      state.tokenize = tokenString(")");
    else
      state.tokenize = null;
    return ret(null, "(");
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
    return type;
  }

  function popContext(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state);
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--)
      state.context = state.context.prev;
    return pass(type, stream, state);
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords.hasOwnProperty(word))
      override = "atom";
    else if (colorKeywords.hasOwnProperty(word))
      override = "keyword";
    else
      override = "variable";
  }

  var states = {};

  states.top = function(type, stream, state) {
    if (type == "{") {
      return pushContext(state, stream, "block");
    } else if (type == "}" && state.context.prev) {
      return popContext(state);
    } else if (supportsAtComponent && /@component/i.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/i.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/i.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
      return "keyframes";
    } else if (type && type.charAt(0) == "@") {
      return pushContext(state, stream, "at");
    } else if (type == "hash") {
      override = "builtin";
    } else if (type == "word") {
      override = "tag";
    } else if (type == "variable-definition") {
      return "maybeprop";
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    } else if (type == ":") {
      return "pseudo";
    } else if (allowNested && type == "(") {
      return pushContext(state, stream, "parens");
    }
    return state.context.type;
  };

  states.block = function(type, stream, state) {
    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords.hasOwnProperty(word)) {
        override = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = highlightNonStandardPropertyKeywords ? "string-2" : "property";
        return "maybeprop";
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override += " error";
        return "maybeprop";
      }
    } else if (type == "meta") {
      return "block";
    } else if (!allowNested && (type == "hash" || type == "qualifier")) {
      override = "error";
      return "block";
    } else {
      return states.top(type, stream, state);
    }
  };

  states.maybeprop = function(type, stream, state) {
    if (type == ":") return pushContext(state, stream, "prop");
    return pass(type, stream, state);
  };

  states.prop = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
    if (type == "}" || type == "{") return popAndPass(type, stream, state);
    if (type == "(") return pushContext(state, stream, "parens");

    if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
      override += " error";
    } else if (type == "word") {
      wordAsValue(stream);
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    }
    return "prop";
  };

  states.propBlock = function(type, _stream, state) {
    if (type == "}") return popContext(state);
    if (type == "word") { override = "property"; return "maybeprop"; }
    return state.context.type;
  };

  states.parens = function(type, stream, state) {
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == ")") return popContext(state);
    if (type == "(") return pushContext(state, stream, "parens");
    if (type == "interpolation") return pushContext(state, stream, "interpolation");
    if (type == "word") wordAsValue(stream);
    return "parens";
  };

  states.pseudo = function(type, stream, state) {
    if (type == "meta") return "pseudo";

    if (type == "word") {
      override = "variable-3";
      return state.context.type;
    }
    return pass(type, stream, state);
  };

  states.documentTypes = function(type, stream, state) {
    if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
      override = "tag";
      return state.context.type;
    } else {
      return states.atBlock(type, stream, state);
    }
  };

  states.atBlock = function(type, stream, state) {
    if (type == "(") return pushContext(state, stream, "atBlock_parens");
    if (type == "}" || type == ";") return popAndPass(type, stream, state);
    if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

    if (type == "interpolation") return pushContext(state, stream, "interpolation");

    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override = "keyword";
      else if (mediaTypes.hasOwnProperty(word))
        override = "attribute";
      else if (mediaFeatures.hasOwnProperty(word))
        override = "property";
      else if (mediaValueKeywords.hasOwnProperty(word))
        override = "keyword";
      else if (propertyKeywords.hasOwnProperty(word))
        override = "property";
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = highlightNonStandardPropertyKeywords ? "string-2" : "property";
      else if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "error";
    }
    return state.context.type;
  };

  states.atComponentBlock = function(type, stream, state) {
    if (type == "}")
      return popAndPass(type, stream, state);
    if (type == "{")
      return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
    if (type == "word")
      override = "error";
    return state.context.type;
  };

  states.atBlock_parens = function(type, stream, state) {
    if (type == ")") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
    return states.atBlock(type, stream, state);
  };

  states.restricted_atBlock_before = function(type, stream, state) {
    if (type == "{")
      return pushContext(state, stream, "restricted_atBlock");
    if (type == "word" && state.stateArg == "@counter-style") {
      override = "variable";
      return "restricted_atBlock_before";
    }
    return pass(type, stream, state);
  };

  states.restricted_atBlock = function(type, stream, state) {
    if (type == "}") {
      state.stateArg = null;
      return popContext(state);
    }
    if (type == "word") {
      if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
        override = "error";
      else
        override = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };

  states.keyframes = function(type, stream, state) {
    if (type == "word") { override = "variable"; return "keyframes"; }
    if (type == "{") return pushContext(state, stream, "top");
    return pass(type, stream, state);
  };

  states.at = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == "word") override = "tag";
    else if (type == "hash") override = "builtin";
    return "at";
  };

  states.interpolation = function(type, stream, state) {
    if (type == "}") return popContext(state);
    if (type == "{" || type == ";") return popAndPass(type, stream, state);
    if (type == "word") override = "variable";
    else if (type != "variable" && type != "(" && type != ")") override = "error";
    return "interpolation";
  };

  return {
    startState: function(base) {
      return {tokenize: null,
              state: inline ? "block" : "top",
              stateArg: null,
              context: new Context(inline ? "block" : "top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style && typeof style == "object") {
        type = style[1];
        style = style[0];
      }
      override = style;
      if (type != "comment")
        state.state = states[state.state](type, stream, state);
      return override;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          // Resume indentation from parent context.
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit);
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    blockCommentContinue: " * ",
    lineComment: lineComment,
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i].toLowerCase()] = true;
    }
    return keys;
  }

  var documentTypes_ = [
    "domain", "regexp", "url", "url-prefix"
  ], documentTypes = keySet(documentTypes_);

  var mediaTypes_ = [
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ], mediaTypes = keySet(mediaTypes_);

  var mediaFeatures_ = [
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid", "orientation",
    "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
    "pointer", "any-pointer", "hover", "any-hover", "prefers-color-scheme"
  ], mediaFeatures = keySet(mediaFeatures_);

  var mediaValueKeywords_ = [
    "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
    "interlace", "progressive",
    "dark", "light"
  ], mediaValueKeywords = keySet(mediaValueKeywords_);

  var propertyKeywords_ = [
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "all", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-fill-mode",
    "animation-iteration-count", "animation-name", "animation-play-state",
    "animation-timing-function", "appearance", "azimuth", "backdrop-filter",
    "backface-visibility", "background", "background-attachment",
    "background-blend-mode", "background-clip", "background-color",
    "background-image", "background-origin", "background-position",
    "background-position-x", "background-position-y", "background-repeat",
    "background-size", "baseline-shift", "binding", "bleed", "block-size",
    "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target",
    "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius",
    "border-bottom-right-radius", "border-bottom-style", "border-bottom-width",
    "border-collapse", "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color", "border-left-style",
    "border-left-width", "border-radius", "border-right", "border-right-color",
    "border-right-style", "border-right-width", "border-spacing", "border-style",
    "border-top", "border-top-color", "border-top-left-radius",
    "border-top-right-radius", "border-top-style", "border-top-width",
    "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing",
    "break-after", "break-before", "break-inside", "caption-side", "caret-color",
    "clear", "clip", "color", "color-profile", "column-count", "column-fill",
    "column-gap", "column-rule", "column-rule-color", "column-rule-style",
    "column-rule-width", "column-span", "column-width", "columns", "contain",
    "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after",
    "cue-before", "cursor", "direction", "display", "dominant-baseline",
    "drop-initial-after-adjust", "drop-initial-after-align",
    "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size",
    "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position",
    "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow",
    "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into",
    "font", "font-family", "font-feature-settings", "font-kerning",
    "font-language-override", "font-optical-sizing", "font-size",
    "font-size-adjust", "font-stretch", "font-style", "font-synthesis",
    "font-variant", "font-variant-alternates", "font-variant-caps",
    "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric",
    "font-variant-position", "font-variation-settings", "font-weight", "gap",
    "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows",
    "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start",
    "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start",
    "grid-template", "grid-template-areas", "grid-template-columns",
    "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon",
    "image-orientation", "image-rendering", "image-resolution", "inline-box-align",
    "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline",
    "inset-inline-end", "inset-inline-start", "isolation", "justify-content",
    "justify-items", "justify-self", "left", "letter-spacing", "line-break",
    "line-height", "line-height-step", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top", "marks",
    "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed",
    "marquee-style", "mask-clip", "mask-composite", "mask-image", "mask-mode",
    "mask-origin", "mask-position", "mask-repeat", "mask-size","mask-type",
    "max-block-size", "max-height", "max-inline-size",
    "max-width", "min-block-size", "min-height", "min-inline-size", "m)N-wiÊt`",  °  mix$BlÂnd-lmee&,!.egvemTob- naVMdnwnÇ®""nav-hndex" "Ó`v-lggt", ~qv-right",
` !(¶naf-ub*, $gbjfc‰-fit"- +orjast-p/sition&, "off3%t&, &oÊd3et)aÓchOR",
$ ` "off{et-,iÛÙance", (ofdcef-0a6`2, bonfset/pmsiuion!, "offset,zotate",
   "opaai4{¢, "opdev"<("ÌRpjans", "outLine, "outline-colo∞"$ &ou|nifa%/ÊfwÂt",
    "gutl)nE-sÙyËe", "outÏmld-˜idth",`"kver¶hœv", !ovepfhow=s4{le ,
0   "ovepbÏo˜-wR`p#, "overfnow-xc, "overFlow-y"$ "¯dding&,0"padding-coˆ5Ìm",
`  "paddhÓg-heftb( `addi~g-sigË|"<$"paddiÓ'-4oq"$$"page", ¶xawe-br%ak-·fter"
    *pegd,jreak-be‚obd", "page-`≤eak}JsifM",8"`Dg5)pœÏigp,†"pauSe $
 % 0"patseafte“"- "rausÌ-bufore"$ bpdr3yecÙÈvu". "peÚcpegti∂e=osigin", "pitgh"
†   #pivcj-sanfe", "pLaae-conteNt".†"0hage-iteÕs", "plas5,selj&, "pla}-‰|rin'",
    "positiÎn, "preÛentction-hefqJ", "psn„Tuetion-tpml",†"1oıes:,
 " `"reßion-cÚEak,aFveb","rec{o˛≠break-cdform",∞&region-cpaak-iÓside#-ä ∞( &regIon-Êrie=e.|"< *Úun`erinÁ-intent*. "Resi:e`,0"rest$,""sestÌcfde`",
&   "se{d-d%fÔze#,Ä bichness", "riÁit&¨†"rOtaTg",""rot‡|ygn,#¢rofa~i/PgiÓ4"¨
    "rw-gapr, "r5bq-e|hwl#< "rU"˘/vezhÂn'‚, "pufy≠xoshÙion", ¢rubx-spin"
    "scald:, "s√rnld-behA~ykr&, 2ycrolÏ,marcI.", "Sgrgl|)mbr&kn-bnoco:, †   3crdl-|aÚgIn-clomj-dNd2§ *scroldm-apfin=‚,.ck=spAR|", &scrolL-Ìar'irottom(  ` "sÎrkll®marÔin%inÏioe#¨("scroll-}arg)Ó-ÈnlangeEnd&.
a   "acroll-Ì@reim-inÏine	st`sd",("3broLl-margkn≠ÌafÙ", "Cbroll/d·rÁ+ÓÚih4",
 `  "scrollmArgyn-Top2l bÛcro¨l-padd)ngb, "Ûcsohl-padd9ng=bLÔ≥k#,
 †   sCÚonl-0qddy|e,bÏcK-e`Ü,!"cc2ol|-p·tdinge"lo#k-qtavt",J "r 2c„rolh-0adDinn•botpom", "Ûcrohl%pa$ˆing))nnÈnE"-"2scrÔËh-tafdin'-iLlyne-Ân`")
    "3crohh-rcddinw-Enlina-spart¢| "Scvollmpadfin?-left"< "scromlmtaddingiright",
  ! "2crolL-xaedi.e-top", "scroll(s~apÈclhgn*, "rcrOlL-snaq-4ypd",
 ` 0#siAxo-iM·ge-tx`Âs`o¸d-"!Sjapek[sidE", "cha emeÚ}Ó*`#˜hapd-o’Tsid•
  " "size"$ "speqÎ"® "cxeq+-a[¢, bqpoajËeader¶, "Sqma{-nuocr·l*,
1   "wpeck-pÙnsvwAtoOn"- "s`eech-rat≈&, "wtresS&, 2suring-set $ "rA`-qizt",
   ""dcvm%-|ayouv", 24asfet", "tqvgmt)lame",( tarÁgt-ndw¢, "tavget=vositIol2,
†! 0#<ext-alkWk¢l0#d%ht!al!gN-lasp",("texÙ+cgmbinO-upwiNjt"® "teyt%decorauaOn"*!`  btaxv©§ecorcq9Ôn,cmlcr2(®t5Xp-`ecÔvat(kn-Ïh~g%0"pept-deaoration)sKip"$™    "t%x|-deKnr)thn-s´Ip-iNk"¨`"dExt=decm~ari/n)WtYLe", "te¯t,%mphasas2,
!0`†"eaxu%eepiasks-color , ¶tuxt-gmpËiskS,`Owy4mon"l"tÂxt-empHasmsmstyla#,
†   "text-hÂight ≠ "t}xt-m.pend, "texu-jestAgy", "text-w`ientqtÈon#,     "texd9ouvliÓe"$ "umxt,ovesflow"- "teyd-revde≤Èjf",)b<mxt§sladn&,
 ` !"t%xt-sÈ:e-adJtst"l *pEyt-spcce=so,lqq7e"$†tept-tra,sfore",
    "textùuÓderlinE}pocivion"- ve|t-WÚaq", "Ùop&.$"tou{h-ac4yon", "tr!nsnoRm""trensfor--oÚi&ij",
"   "tjaésfw]=style", &ts!nsÈumon", "tra.sivinn-nÂ$ex"("trsnsmtkon-f52eTyjo2,J‡* 0"traocHpinfpro|eruy*- "transitinn-tioync-nsncuio."l "trqnslYte",
    #unmkoda-"ad)b "}sdr-wg,ekt", +vmrti`al$al)gN2, *vi3)bÎlhıy"¨`¢ˆ.icm,calansÂ",*( † "voice-d˜ration",$"voi„a-family"l #fkksÂ)piuch", "voiCm-ra,oe"$ ¢÷mice≠Úa∂e‚
($`  ~oice-svreÛr"."w/ine=vomuMa",`"vOÏumE†, "whmte)cpace", "widogs"$""whth"(
    "will≠cHaÓoe", 2wozdbrgak", "wkrd3pacing",‡"word-wrap"l "wri4Ing-modi", "z-ine}|",    //0SVC)specifiÁ    bsÏip-paqh, rcli`-bule"l%bMaqk", "Enabhu-bSckgrkun$", "fihter", #flod-cOios ,
 †  "dmoo‰opa{i|y" "lYghtijg-cklor *stghc}Ëor", "wtmp-opac)t˝2, "poi.P%r-eve~usb,†`$ "„onor-y~îertolAt)kn",†2co|oz)ilteppohation≠fkÏtepÛ",
&)$†*coMoRmrdfdebmn'", dill",""filL,-packÙq ,  dyÌl-rwÏe",0"image)send·ri~g#0†"("mqr{et , 2mQrkdr-end"-!"mazkr=iid#. "markGR-start"- "pAiÓt-o{d%b&. "shape-rgfvmvhng",("surke, " `¢cdroke%d!l!rray", "stro+e-d·3¯offst4"("wtr?ke-li~ec·p", "sDrokeem)nejomm"(J    *stroke-myvgrmimip",†&strOÎe'g`eciuy", ""trlka=width",("td(t)wU.dÂring",
  ` #&`se|ineçsligt*< *dÔmiÓiNt-neÛalIne",  glyph-mziÂflat…on≠horizo.4al"ä  ( 'dyph-orie.tetionvu˙tÈca|24 "text)·dch/v"-0.s2itIng-mm$‰2,*  ], ÙrmqerÙyK!yWmrm3p=ÇkEiSet,properTxOeywnzDs_) 
  vav!.onSteNdas‰PzoPerpÒkÂ}worhq_0= [
    "border-BmocÎb, "brfEÚ-jÏÔck-cnDÌr", "bkR`Er-b,oSk(end",
 "P "borderçrlock-enl-colv"¨ "bovler-blobkmeÓd-styleR, +bÔıfer%blo„k-ent-wmdt`2,
,   #bordÂr-#lock-spiÚT",$ "o2ler-Rlo@k-start-col-r"$ "boTlmrmjlocÎ-wpartmst}lÂ"<J    "borde:-Úl/ck-stabı-w)dth"¨ bordcr- l/ci/3tye0, ¢bÎbdır-clÌckmwiÏ|h",
 ,  "bozder-In,hÓe2, "borddr)inLIne-knlor"¨`(bozder-iol)ne%%nd",
0   "iw6pÂrΩin,inEødnd-aolo2", "‚Ordev-ihhinÂ≠efd-st}n%&-
 $( (cÔr`ar≠inline-djdmw)dv8", "bzder-iNline-Ût!rt", "skrder-h*LiÓeØstaÚt-coloÚ"
    &bovdereiNline-suaRd-wuyle#, "bo2ter-inlane=rturt-sid4j",
`   "bordepminLknE-rt9le",0"jorder-inline,widtH2†"a!2eiN-rlocK",
  ` "Ìazgij-bÏgck-end"<(2mcrgin-bl„k%s|a:t"lb"=cpoa.-i.li˛e&,!≤IargIL)i~,ije-·nd",B "  "margininlYne-quarp¢, "pa‰4snFblock", "Pa<ding¨blkci%en,#§
 &  "paddind/bLo„k-sTcÚ}"L #Padd)nG%inlinm",¢BpaddioÁ-ifLi~E=enDrd†0  "paddinw/inli~e-{tyrv"- .rcr}l,sn`p-stcr*- "scro,lbar	3D-ligh4-cglmr",    #s#voL‰bar-prrow%cglÔÚ", &{gpn|®bÌr-`asu-color3,&&{#vollbaR-$ark-sjadog-co,orbl
 § ""scrÔÏLbar,fice-co|or"< "ccromlcqr-hyEhlyghv}colmr.!$"sbvOllb·r-sha$o'Mcm-or",†   "scVollbar-track-cÔÏor,$bsearchnIell-canceL-feteon2$ s-archvi%ld-ddSNpitio~"m
 $ & suapbhfheld-results,‚ut0on, "r%qrchfield-resumtq-eecnrat·on"( "s(ape,mjrmdÂ"-("zoÓm"
1  nnSt!ndardProxe2ÙiK%yGÔsds = cu]Smt(vonStandaslTroperÙyCu|sordÛ_);

  var vknpPropu2u)es_ = [K! ! "font-display § 2fmnt-Êalily" "brc",0"u.ignde%ranfe", "F/nt-vabiinÙ",
  `$!"k~t-fgature/settins", "fknt,Ûpreuch",`"font-s%igmt", rfoŒv-suylE" !\¨ fontPrÔpdjthÂs =0ie}W}tfootP/pEptieyO1;
  var kÎÂnterƒescrit4krsW = SJ   (™aldkthVe,3ymboLr"< bfall"eKk"¨ bn%wcTive"((≤P`d
- "|ragk|",H"fangE",
 0( "wxE·k,bs, "suv$ix, bwymboËs", ˇybte%"™  Y, CouoterAescrmpÙors =0myWat(#ownÙurDescryqtorc_$;

  vaR c?LKrKaxwmrtz_$= ZJ``  "alacaflue" ¢`ntiquewhiteb< *Quea"<  kque,ari^g‚.`bazure",! jEige",
  8 "bi˜qua"- #`La„k",hcblanch‰d!lmond , "klue#( #blugvi/let",$"bbowo",
 !  *buRl9wno%", "cadet‚nue","&chartreusE"`#oho#'l!t%", "sor!n", ¢coÚlbnOwerblem*,
@   ¢c{rNSilk"- "cr)Ìson"<`„yin"< "daÚkblu"(!&d·ricyan"<P"eajÌgOldunjom",
   "darkgray¢,$"lir+ureÂn"l "`arjclcki&, "darjlagel4a"(0"dariglivecruen ,
$p`0#darkO2·Nge , ¢aeP+oXchid"*""eaRÎRed", ´darmÚ`leon", #darjseegÚeuL"4
 (! "tarkSlAtEbluE¢$ 'depislateGsay"º "%arotırqu/iwÂ", "darkVild\"l†  !"deePqina", dumtsk˘bhuÂ", "b)mgrey"$ "dodgeÚ#luA*-	"firbÚick",
p   *floRQL7hite ,%"forestgreeo"- "fushsia",`¢gaifsbmÚo+, &ghostwhite",  !†"gol$", "œoldenrod#, bgÚ`y"l "gpdy;,0"gve%n", &grEenyGlko7
. "hknE}ddw",J    2hoppInKj, "IÓ$iÂfrgd2> #IN$igo", "ivory , "k¯!„i",!ÇlaVeOdmr"(ö !  Bl`ve^terblısh",!"h`wncreen", 'lamov„hÈffon"( "Ligixblwe*," lAg(tcorql¢J    ",ightc{aÓ"< "`Íghtgon$enpo$igllgs",""li'hÙgray", ",ightgr5en",""li'ht`i,k2,
   `"dightsaÏhojb(!RligHtseegre%n",%2lich|ckyblue",†#lighÙslatees°y",ö0  ""lÌgËts<gdlc,ueb""lighTyuÏlov"- "lIme"(""dmmegrÂÂ| , "lilen", mcgevta¢,
 ( $"mAb/on", bÂedhıl!suam¡zine"$p∑oeviumblue2, "mddyumg2chit¢, "mediw-r5Úplm&,  $ "m`yumqEegree~, "mE¶iumsdcteblue", ¢oedi}m[pV)jÁgreen"-""mediumturquoiseb,
   0"lÂ‰ItÌvioldtreD*,""ÔadNig(tchue&,""laÓtcreaÈb, bmiStxrose&, bmocsasan2,
    bnevqjÓwhKdu*< "naˆy ,  oldla„e2, "ollve¢¨"gliUedrab"l &oˆanÂe"-0≤{rÒnogzed"Æ
  0 "orsHi§"-$#0aleßOldejrodc "xalegr}en",†"paleturuuoise", &paMuv˘ometred"
    &papayawhÈp", "xdskhpuff",("pUru", "p).k", #plui", "PowD≈rblue*-k" ""p}rple". "r' gcK·purrlm ,§ rEd", roÛybto_n", "gπ!lblUd", "sadllebrown",
    (sallÎn"$†#s!ndybro˜n - "3eagreej", "secsÍelh",1*sien~a", 2siÏvdr¢, ¢;ÈycNˇe",
   "slatujnue", "chategraX",d†soowb, "s1rinCgraen",`¢rtAenblua", b4`j <
  `†"pdan&,Ä"t`istld", "to}a6o ,Ä"55rquoise&, "6ioÏut", bWhaV#, "cx)te¢,#  (¢xitIsmokEl "yelm/vb, "yel|o∑kreen 
" _-0coÏorKDywor@s } kgySet(cOmozKayworls^-;Z
 $vaa ˆa<ueeyords_ !S
# 0 *above"-0"acsolıÙe",  icpiv%berdgr"¨ ba$diTkve", 2`buiveaapuk´nbh*afar",
!  `2antar=uhqTesPqce", ¢ahmad"= "@liar"¨†"all", "cllscvoll"n0alphac%tyc"¨ "alterneteb,
 0  "|w!ys", "a}haic", "Èmharycabggeƒ·", "aNtiAle9sed¢h "!rpw/zkwp‡ce"-J$"%$¢ar·bis=yndis",p"#reenia.", "asderisks", "`Ùt"", "`uvn, "eeTo-&low"~%&aVOid", "aoidmcod}mn"( ≤a÷oid-pegı"
 *  2avomd-reo).n*. #axmspan"<$"jaskgrounf  baciwards",""fdseline",$#belos", #bIdi-o~%Úrmde", "bkjari2,
   2Beng·li†,("bliÓk"<*"blnbk", "`moakiayys#, "bkl‰", ¢cmldEr", "brder&,`"Border-box",
!0  "bOTh "joudomb,0 rreA#, ¢‚rmak-cll",4"break-word",0"be|letp"å0"cuT4no",(#"›tton/bevel(* `† #bUtuknface", "bUÙÙonhmgh|ioËtb, bbutuoNsiafow", 2fUdtontext", "„elc"- "„amboliqn",   ("carIta|yz%&, "caps,locÎmin$ic!tor&( "#a`dakn",‡3kaptjKnte|u", "caret",
    "„ell"- "cendeÚ", bchekkbox"l "circle",Ä"czj-d%cimal&,!"#jj-eÅrtxl9-bpaNgh",    "cjk-iaAwÂ>lx{teÈ , bbjÎ-idmogra0hic", ™cleAÚb,8"lip2,("clnwe-Òuote*
   &col-sesiõe", "KonÏapse", "aolNÚ , !codos-jurn", "Col}r%dm$gÂ*,!"col5m~", "go4umn/reverse",
    "compabD", #coN‰eNsmd" "cOJtaiÊ"¨ "c.teÓt£, "cKnt%j4s*<
†   "cn*tg~Ù/box": "co˝e}t}menu ,`"contiÓuoıq", "copy , "„oÓpeÚ&6  counÙerq#,`"bovdr",!"bror",
 $ ( szocs", %croSsiair"< cerrenTco|oj",("cursÈve"$ cyclic&,!"diro%f2, "q·hed" "eechmalb,J   †&deGimed-Ïç‡dhÓg-zrk",$"dufauld¢,0"deÁauht-bE|v/n",$"dE.sÂ",0"tÂstaoatIog-atop",    "ddsti~·Ùjo.-Èn2, "‰ectifat)oo-Øut",†*tastination-ÔveÚ"(&‰evmnag·zi"¨"difdermfkd",
    "disB, "d`s„arD",0"dhsclocıre-closed"¨&eisclosuf%-opeo"<%"`kcu$Ânt"L
   †"dot,$ish&("goT-dkı-da3h#,
    e/t¸ed",‡#doujl}", "`kgn", *e-rasi*e", %`se¢,¢EaSd-an", "%Asemi.-out", "e!;e-out¢*
 0  *elemenu",$belLi0e", 2Mdlmp#is"¨)"embed", "eld"! Ça$hio‚i„¢< ,ıthiopic%abegmd•",
    "gt`iopi#-abeoEde,aH,eÙ", "Ât`kgphc)·bggete-fuz2$ "ethiopicmaBegede-pk-er",
   ¢ethiophc-afegedm,ti-mt",(2%t(iopiaËalehame-Aa=er#,( $!&dtËioric-dalexameaa-eT".†*evhiupig-hi}e`amÂ=am-qt",J    "ethÈGpicmhale¿ake-gÂz(l "ethiorys-h`l%Ëame-ommeÙ",
 0` "edhioxyc-yalelameØsid-dtb. #etjiopic%haÏeh·me/so-etÇ<0   *e4hinpic-hAleHcme-ti=eb",!"UlhioqÈc-halehale¨ui-E|Æ$"mÙlyo0ic-ha|eja%-tig"Lä  0 "eThkopjc-numevia", "$w-pesize < Çex3lQwion"( "expundÂ$#, "%xtdndÛ", "mzura-„/Ófen{ed#,
  $0extrq-expa.edd", *cAjtAsy ¨"2bact&, *filh&$$"&Èll-bnx&, "firedb, "nl·t",a"fnu("¨""fle|%end"("flex-S4a2t", "Ê/opjotes"8
  † "Forwards",†"fpoO" "fuomgtzi„xRe#hsion",!"georÁIcn", 2g∂a}text¢< *wrid&$ bwrnovE", ‡  "gtha~aÙm",(#euplubji*, *h!n¿", &hangum(,""haÓg}Ì-#onaonanT", "h`rd-laejt", "hebvew",
   `"helt", "hidden£, "Jidm", "hHgËer&l "hy'hÏicht",!#h9ghdaghttext"¶  ! "HmragAna&, #iÚAGane≠)roha&,`"hmrkÚMntaÏ", "hsl", "hcla,  dte"l "mcoo", ionMre ,
    &inaktitubovdEr", "i|actevecaptÌon&- "inAstmvesa0tioftuxtb= "injini|e"
  *("ingoba#igvo5nD&- ")nFovext"$""klzerit™- "initial", &inline,`"i~line-axiq", ` "iŒline-blo#k", ">line-flEx¢, "i^mkne-grÈd", "knli~e-tbbhe,b¶I&seÙ".¿£iside*,†"intsInRic",(binvert",
   0&Italic", "jq0ane3e-Áormal2, "jepanare-anfÔread", "ustify"$ *KannaTa6,
    "k!pakanÂ",êbkauakcna,irkha", !kÂepql,"$$"khmgr ,ä † "korean-hanÁÒm-norm!\" "kgrl f-hanka/NRmql", "korean-(ALje-infornah",
  $ "maÆ$scaqec, lao". "laree*n "l·Úgeb "Ïeft".  lÌfel¢,""lighteÚ" *lhghten"-
 (!"\mnd-tiRo}oh*, "hijmap",d"lÈfÂcr-graeiuÍt"< "lËÔes¢D "l)st-item", "lictbo¯ <0¢liStitem,
¢  ‰bloc d","*logiain$%",Îıt", "|ower"$#*lower-AlpheB, "l/wGr-AÚmenÈan*,
   †"lo7er-sreek", ",oser-HePa‰dciAl"¥ "loWerimatiÆ",0"mower-nOrvegIÈn",
`   "lGw%2-rmÌanb, "oowerceÛe&,†"dÙZ", ¢lumanmsmu˘-!bma|ayalcm", bm nip}-ctiÔn",! }adc`", ≤maprax*, "}avrix3f",
 b `&eedya-{gNurols,ja"I'ro}.l ,`"Ìeei`/ctrvanÒ=tImu%displa[¢,ä  " "Õmdma-fuioqcre%n/button¢, "media-mute-buuton", #mEdÈa-play,BUdfon",
†  0"medie=return-to-ve·ltAmembuttgn¢,$"media/rewiNDebuuTon ,
$# (2mmgiaseeÎ-"ack-butugn", "meda`/seeo-forw·≤e/cıtv-fb- "med)a-slideR&,    "medk°-s<idmrthumb*$ "med-A≠timd-reo`inilÁ-§is0l@y",‡bmEdia©vOouie-sLidez",
#   "m•tai-ˆolÂmm-sli`!r-cntailer`l "-!di‡/f/lwle-s,id%vtÏumb -("m%Ditm"* 0  "geNw0,0"lentlist", 0mÂ~tH)st/‚Uteon",†¢menudk3t-tÂyp"¨!   "me.qLisT-t%xtfheld"l BmE>epext", "mGsSabe-bmx" "mkdd|e#, "mkn)i."in{ic",
00 $"mix", "molcn|)`n"l†"mo./spage", "move"¨ 2-uldyple, "gel|iplGWmisk_mma}es,$&mulÙi0hy"(Ä"mya.mAr"º( n-resiza",
   (#v`broeeb2, ¢*e-sesixe ,""nuÛw-resi˚e"® "l{-closa≠Qwote¢, "no-drop ,
    no-{pdn-qtote",  go-Úep%at", "/ke"- "n/wkal",9"nÎTqLlnwad&,0"no˜rip",
    "ls-resoze"< "nemBers. ".umgr9„ ,0&n)reiize",†#nwqempesi;e",$¢nbhique"@*OctA,b, "Opacity2, "opeÓ-quote",Ä  $"ovtimizeLaok‡ÈliÙq", "opT)-i~eStee‰", "oriya",0"k˙omo" *outsEu¢,
#$00"oudsiDeb,†"out1idÂ≠shaÂ","&oVerxay¢, &ov5rlinu"=†"`afdÎne¢,0"padDing-‚ox",*    qiNtga"("fpmÁe",  pawsdd ,!"P%“shan", "Úerspe„tive,"Çbingh-hool",†*`lus=dcˆKÌs"l "(husm|Ëwhter",J $(†20oaNtÂx$ "rolxgon . "xorvraatb,pre",!"Pre-lkne", "PRe-raz2, #preser%=;d",  " "pÚ7bess",@"pı{h`5tton".0"radiql-graÏieft"¨ rbaˆho",("reae-/dl8"§
    "reaÙ%wriuu&, "read-grkte/plaintexp-n.l"l†"rectangle° "regioœ",
 `)†"relcti{e"¨ "rƒxeav"$ "re0eapiOg≠|inear=ÈzafiÂjt"
!   bbepdauing-ra‰iel-gvafyelt"& "2aqebt=x, "repeAt-y"- "Úesa‘"l "reˆurs%¢,
  a "rÁ‚", "rgrq", "ri$ce"§ "rIgJu",!#roT!\e", "rKtate;‰",""rotateX"$ "rgVatdY",
  ` "rota|eZ#< .ro5~d"8 &ro˜"$ "row-rdÛizg"0"Rm-ruveRÛe"® "rul",†"`]o-iÏ"¨0#zwlfing"$
D   ¶c-resIze¢. "caÓs-SeriF", "ra‘ur·timn", "SAalm", "scalel", "3cane", "rca,`I&, *scaleZ l "sgruen"¨
$$ 0"3cvolt m "Cc“o,Ïbis"l *srll-@Ôsitin"l se-resizÂ", #Searchgief`¢,
  $ "sÌapchnieÃd-c`Fcel-buTtÔn", "sEashField%decoVavi/n"-
    "seaÚcÈfkend-restltw-bupton",!"se·rcxfÀ≈Ï$-regults-eecorhtimn¢, "self-stazd"-(bze|F,eÓd"-
:   "2emi)coodtoset¢8 #semi	exp·ndEd", "sexa2atd"¨(s‰Rif", $sHmw≤,("sidama"-    "samp-cliNese-nOrma,""qihr-c(IneSe}9zformaL". &smnGÃe",*` † "sYqw#¨`#skegX",""sÎewX", "sÎiq%vhktespace",$
s|ide"( "snmdeÚ-hopIzon4el2d
    *klider-6%rtikAl". "3lad≈vphumb-`mri~oNtil", "s,ideÚpnteb/ve2tikalf, 2wlow".
!  0"{-alL≤l!"smalË≠capw"≠ "sm ll-clrtIon¢<(¢w}allez"< *s/fu-lkGhT"¨""€did, "ÚolAli6,*  ( "sourseadoq", "sou{cu-in". &wowr#e/qu"< 6sour#e-Ôvmr (&s0acm", "spece9`rounE"(`"spabg-"uvuedn¢,""s!c5-%reNl}&.  s`elÏ-gut2, "{quare",
  ! "ssqare-beTtÔo"-0"stcrt"Ï *sTa|is2, "rtatus-bar2,0¢str%tcH,†2wVro{e"< 2stroke-box*,†¢3eb"8    "surizuh-antaalicse` , "svgOeAsks¢,`"cuper"- *sv-Ûeize"4  ˆ˘mbolkc", "symbmlq",8¢sYstEo-i"< "table",
    &pableaiption",(*tq`lh-BeLl"¨ "tabhe%co\uml , Qale-codwiN-groep",*    btab,e-footer<frouq"Æp3table-heaeer/Ávou`", 2~@bÏe-row#.0"ta"le-rÁw-gbouh ,
0"  "|mm)l",
 $  "ÙÁ,ugt", "teÿt",2 pe¯u-bottom,"tdxt-tob"0*taztare° , bvÂx4gieÏ4", "tHay $
    "Ùh)c+". ¢thin",0"t`reedd±rKs`Ado˜¢, jthrdedfaC5", "6Ïreedhig(Laght",
$ ! ¢ÙhbeedlygËts`1do", ftJrÂl$sHadow&, "tiÊetan#, btyÁ2%#( "u9gri~ya,mr",
    "tyÁpiny)-er/!begg‰A&,$"thgZi.y!-%t&, "tiwsiÓy`emt-qb≈eUdE", :to",`&top£(É$`$(`trad/khiF%se-form·n#- *vrAd){hineseÌÈ~&ormuH"< 2t`a*wfGzM*,*   "traorladef, "translate3d , "trqf{$ateX", "Ubancl`tUQ",`#vbinslatez", (  "trinÛpire~t*, ultra-cgndensdd",§bqdÙ2a-5xpan$eD*,!2uNlerline, "ufidipectional)pEo", "ulsat"¨("up#,
!`  "upper/alpha"¨ "upper`bmgnian". "ttper-gr˝ek:≠!"uppEr≠hexate%ymkl",
    &upper-l·Ùhn2, &up`Âb,nobwegiel"- "qrpev.~o≠io"\ "e`p%r„ase",("ırfu"¨ "u≤l2,
 ‡¥ #var$ #verticl"< "vmrtical-te¯ı*l(viewmgox",!"wIÛible, "wi3i"ÏeFiÏd"¨ "w)si"dMQ`mmtet",
    "visifnÂstr˝ke",0"viq5·l ¨4"w-resIzi", "w·it"$ "wav‰!, &widtp",J  ( "7ineo¢,)¢winn/ufz·e%*, 3sindo∑te¯|"l`*words", "wv‡p . ¢wrap2evdrwe!, "x-lArge&, ´∫){mald"-!"x/b",  ""xx-ha&ge", ¶xx)Smallf
:"ù, ~alweKeywrÆ3 =&jeySet8vqlueÀe}wordÒ);
J  ˆar aHdWOrds ø docuÕentTypes^>cÔnc`d(mÂdkaTypes_).goncav(MmdiaF%aqe2eı_).g.Ncmt(-e‰i·VamueKayw/rdR_)   !.concav(rrope{tyCe{vordq_)&aonc·|,nonS4·feq{PrGpebu˘Keywords(,conCat(colorKeywords_)   ".cooc`t)vql}„Koys/rds_©?
` ”ode˝iRror*pugkSTdrHelpÂp("hjnt_o2ds2l$"„qw:- allnrds+?

! F4netionhtokenCCglmenu(streaÌ, sua|u+"{
  $bvaz maibeEn` = faås•, c`;
0   whiLE  (c`(-!struamnoÂxt,))(! null) {
 †  " if&)mayjeEld!'&0„h ==0*/") {
        stape.|ok!NiZg =hn5l|;
 "†   ( break;
"`  (}ä    ! ma}BeEnd(=†(ch == &*j);*   †|"  1bEvı2l ["coOmen|", "coeienvY;
  }
$(CÔteMiÚpor.decineMIMÂ*"Ùdx</css", {ä"   documebtTis·s:$doctmentTypes,   $me`i·Tipes: melkAWy—e3,
d   -epyaFa!turU{: m`diaFea\rec(
†   Âedi#÷alUekuyww3fs: meDMa^qluE…mywnrdrlä   `propurt|Aoyuo2es: propert{Àeyuordb,
    nonSpandareYroXeptIKm˘Wirds: ooTti~dartPrOpdrtyKu9wÔrlc,
    FonvProperTÈeq: f/NtAbo0asties%
∞• $io=n|epT‰sc2iPunps: coqÓVerDmwkriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/^\s*\{/, false))
          return [null, null]
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });

  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });

  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });

});
