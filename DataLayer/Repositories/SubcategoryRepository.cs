using DataLayer.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repositories
{
    public class SubcategoryRepository : BaseRepository<Subcategory>,IRepository<Subcategory>
    {
        public SubcategoryRepository(ProjectDbContext ctx):base(ctx)
        {

        }

        public List<Subcategory> GetByCategoryId(int id)
        {
            throw new NotImplementedException(); // Burada kullanılmayacağı için boş bir implement açıldı.
        }

        public override Subcategory GetById(int id)
        {
            return _ctx.Subcategories.Include(c=>c.Category).FirstOrDefault(c=>c.Id==id); // Bir alt kategori eklendiği zaman üst kategorisi ile birlikte gelmesi için yapıldı.
        }
    }
}
