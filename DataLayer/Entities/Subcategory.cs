using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entitites
{
    public class Subcategory : BaseEntity
    {
        [Required(ErrorMessage = "{0} Gerekli"), Display(Name = "Kategori Adı"), StringLength(30, MinimumLength = 2, ErrorMessage = "{0} {1} ve {2} arasında olmalı.")]
        public string SubcategoryName { get; set; }

        [Required(ErrorMessage = "{0} Gerekli"), Display(Name = "Açıklama"), StringLength(100, MinimumLength = 2, ErrorMessage = "{0} {1} ve {2} arasında olmalı.")]
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Subcategory Category { get; set; }

    }
}
