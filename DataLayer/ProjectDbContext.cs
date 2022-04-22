using DataLayer.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer
{
    public class ProjectDbContext : DbContext
    {
        public ProjectDbContext(DbContextOptions<ProjectDbContext> options)
         : base(options)
        {

        }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Kategori oluştururken bir üst kategori olsun diye data girildi.
            modelBuilder.Entity<Subcategory>().HasData(
                                                new Subcategory { Id=1, SubcategoryName="Tüm Ürünler", Description="Tüm Ürünler Burada"}
                                               );
        }

        }
}
