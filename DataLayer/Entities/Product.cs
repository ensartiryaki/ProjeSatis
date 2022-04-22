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
    public class Product : BaseEntity
    {
        [Required(ErrorMessage = "{0} Gerekli"), Display(Name = "Ürün Adı"), StringLength(30, MinimumLength = 2, ErrorMessage = "{0} {1} ve {2} arasında olmalı.")]
        public string ProductName { get; set; }

        [Required(ErrorMessage = "{0} Gerekli"), Display(Name = "Açıklama"), StringLength(100, MinimumLength = 2, ErrorMessage = "{0} {1} ve {2} arasında olmalı.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "{0} Gerekli"), Display(Name = "Fiyat"), Range(0.01, 999999.99, ErrorMessage = "{0} {1} ve {2} arasında olmalı."), Column(TypeName = "decimal(8, 2)")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "{0} Gerekli"), Display(Name = "KDV"), Range(0.01, 999999.99, ErrorMessage = "{0} {1} ve {2} arasında olmalı."), Column(TypeName = "decimal(8, 2)")]
        public decimal KDV { get; set; }
        public int SubcategoryId { get; set; }

        [ForeignKey("SubcategoryId")]
        public Subcategory Subcategory { get; set; }
    }
}
