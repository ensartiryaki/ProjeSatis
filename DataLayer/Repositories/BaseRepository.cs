using DataLayer.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repositories
{
    // Tüm repositorylerin buradan üretilmesi için yapıldı.
    public abstract class BaseRepository<T> where T : BaseEntity
    {
        protected ProjectDbContext _ctx;
        public BaseRepository(ProjectDbContext ctx)
        {
            _ctx = ctx;
        }

        public virtual T GetById(int id)
        {
            return _ctx.Set<T>().SingleOrDefault(c => c.Id == id);
        }

        public void Delete(int id)
        {
            T silinecek = GetById(id);
            _ctx.Set<T>().Remove(silinecek);
            _ctx.SaveChanges();
        }

        public T AddOrUpdate(T entity)
        {
            if (entity.Id > 0)
            {
                _ctx.Attach(entity);
                _ctx.Entry(entity).State = EntityState.Modified;
            }
            else
            {
                _ctx.Set<T>().Add(entity);
            }
            _ctx.SaveChanges();

            return entity;
        }

        public virtual List<T> List()
        {
            return _ctx.Set<T>().ToList();
        }
    }
}
