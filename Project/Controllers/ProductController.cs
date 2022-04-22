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
    public class ProductController : Controller
    {
        IRepository<Product> _repository;
        IRepository<Subcategory> _subcategory;
        IMemoryCache _memoryCache;
        public ProductController(IRepository<Product> repository, IRepository<Subcategory> subcategory, IMemoryCache memoryCache)
        {
            _repository = repository;
            _subcategory = subcategory;
            _memoryCache = memoryCache;
        }
        // GET: ProductController

        public ActionResult Index()
        {
            List<Product> model = (List<Product>)_memoryCache.Get("ProductLis");
            ViewData["Subcategories"] = new SelectList(_subcategory.List(), "Id", "SubcategoryName");
            if (model == null)
            {
                model = _repository.List();
                _memoryCache.Set("ProductLis", model);
            }
            return View(model);
        }

        [HttpPost]
        public IActionResult Index(int id)
        {
            ViewData["Subcategories"] = new SelectList(_subcategory.List(), "Id", "SubcategoryName");
            // tüm kategorilerin Index sayfasında gözükmesi için bir buton oluşturdum ve o butona hiçbir şey seçili değilken tam ürünlerin gelmesi 
            // için id si 1 e eşit olan tüm ürünler adında  bir seed data ekledim ve butona boş tıklandığı zaman tüm ürünleri listeliyor.
            if (id == 1)
                return RedirectToAction("Index");
            List<Product> model = _repository.GetByCategoryId(id); // Tüm kategorilerin listelenmesini sağlamak için yapıldı.
            return View(model);
        }

        // GET: ProductController/Details/5
        public ActionResult Details(int id)
        {
            Product product = _repository.GetById(id);
            return View(product);
        }

        // GET: ProductController/Create
        public ActionResult Create()
        {
            ViewData["Subcategories"] = new SelectList(_subcategory.List(), "Id", "SubcategoryName"); // ürün eklerken kategorileri options olarak seçilmesi için ViewData ile yolladım.
            return View();
        }

        // POST: ProductController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Product product)
        {
            if (ModelState.IsValid)
            {
                _repository.AddOrUpdate(product);
                _memoryCache.Set("ProductLis", _repository.List()); // Yeni bir ürün eklendiği zaman cache in yenilenmesi için yazıldı.
                return RedirectToAction("Index");
            }
            return View(product);
        }

        // GET: ProductController/Edit/5
        public ActionResult Edit(int id)
        {
            ViewData["Subcategories"] = new SelectList(_subcategory.List(), "Id", "SubcategoryName"); // ürün editlerken kategorileri options olarak seçilmesi için ViewData ile yolladım.
            Product product = _repository.GetById(id);
            return View(product);
        }

        // POST: ProductController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Product product)
        {
            if (ModelState.IsValid)
            {
                _repository.AddOrUpdate(product);
                _memoryCache.Set("ProductLis", _repository.List()); // Bir ürün editlendiği zaman cache in yenilenmesi için yazıldı.
                return RedirectToAction("Index");
            }
            return View(product);
        }

        // GET: ProductController/Delete/5
        public ActionResult Delete(int id)
        {
            _repository.Delete(id);
            _memoryCache.Set("ProductLis", _repository.List()); //Bir ürün silindiği zaman cache in yenilenmesi için yazıldı.
            return RedirectToAction("Index");
        }

    }
}
