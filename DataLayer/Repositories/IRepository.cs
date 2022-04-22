using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repositories
{
    // Base repository den üretilen repoların kullanması gereken metodların kullanılması için yapıldı.
    public interface IRepository<T> where T : BaseEntity
    {
        T GetById(int id);

        void Delete(int id);
        T AddOrUpdate(T entity);

        List<T> List();

        List<T> GetByCategoryId(int id); // Tüm kategorilerin listelenmesini sağlamak için yapıldı.
    }
}
