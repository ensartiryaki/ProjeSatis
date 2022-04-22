using DataLayer.Entitites;
using DataLayer.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Controllers
{
    public class SubcategoryController : Controller
    {
        IRepository<Subcategory> _repository;
        IMemoryCache _memoryCache;

        public SubcategoryController(IRepository<Subcategory> repository, IMemoryCache memoryCache)
        {
            _repository = repository;
            _memoryCache = memoryCache;
        }
        // GET: SubcategoryController
        public ActionResult Index()
        {
            List<Subcategory> model = (List<Subcategory>)_memoryCache.Get("CategoryList");
            if (model == null)
            {
                model = _repository.List();
                _memoryCache.Set("CategoryList", model);
            }
            return View(model);
        }

        // GET: SubcategoryController/Details/5
        public ActionResult Details(int id)
        {
            Subcategory subcategory = _repository.GetById(id);
            return View(subcategory);
        }

        // GET: SubcategoryController/Create
        public ActionResult Create()
        {
            ViewData["CategoryId"] = new SelectList(_repository.List(), "Id", "SubcategoryName"); // Kategori eklerken hangi kategorinin alt kategorisi olmasını options olarak seçilmesi için ViewData ile yolladım.
            return View();
        }

        // POST: SubcategoryController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Subcategory subcategory)
        {
            if (ModelState.IsValid)
            {
                _repository.AddOrUpdate(subcategory);
                _memoryCache.Set("CategoryList", _repository.List()); // Yeni bir kategori eklendiği zaman cache in yenilenmesi için yazıldı.
                return RedirectToAction("Index");
            }
            return View(subcategory);
        }

        // GET: SubcategoryController/Edit/5
        public ActionResult Edit(int id)
        {
            ViewData["CategoryId"] = new SelectList(_repository.List(), "Id", "SubcategoryName"); // Kategori editlerken hangi kategorinin alt kategorisi olmasını options olarak seçilmesi için ViewData ile yolladım.
            Subcategory subcategory = _repository.GetById(id);
            return View(subcategory);
        }

        // POST: SubcategoryController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Subcategory subcategory)
        {
            if (ModelState.IsValid)
            {
                _repository.AddOrUpdate(subcategory);
                _memoryCache.Set("CategoryList", _repository.List()); //Bir kategori editlendiği zaman cache in yenilenmesi için yazıldı.
                return RedirectToAction("Index");
            }
            return View(subcategory);
        }

        // GET: SubcategoryController/Delete/5
        public ActionResult Delete(int id)
        {
            _repository.Delete(id);
            _memoryCache.Set("CategoryList", _repository.List()); //Bir kategori silindiği zaman cache in yenilenmesi için yazıldı.
            return RedirectToAction("Index");
        }
    }
}
