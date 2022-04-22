using DataLayer.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repositories
{
    public class ProductRepository : BaseRepository<Product>, IRepository<Product>
    {
        public ProductRepository(ProjectDbContext ctx): base(ctx)
        {

        }
        public override Product GetById(int id)
        {
            return _ctx.Products.Include(c => c.Subcategory).FirstOrDefault(c => c.Id== id); // Ürünleri getirirken kategorisi ile birlikte gelmesi için yapıldı.
        }

        public List<Product> GetByCategoryId(int id)
        {
            return _ctx.Products.Include(c => c.Subcategory).Where(c => c.SubcategoryId == id).ToList(); //  Ürünleri getirirken tüm kategorilerin listelenmesini sağlamak için yapıldı.
        }

        public override List<Product> List()
        {
            return _ctx.Products.Include(c => c.Subcategory).ToList(); // Ürünlerin kategorileri ile birliikte listelenmesi için yapıldı.

        }
    }
}