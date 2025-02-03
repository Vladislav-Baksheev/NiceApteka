using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NiceApteka.Data;
using NiceApteka.Models;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly NiceaptekaContext _db;
        public ProductController(NiceaptekaContext db)
        {
            _db = db;
        }

        [Route("products")]
        [HttpGet]
        public IActionResult GetProducts()
        {
            var products = _db.Products;
            if (products == null)
            {
                return NotFound();
            }
            return Ok(products);
        }

        [Route("product/{id}")]
        [HttpGet]
        public IActionResult GetProductById([FromRoute] int id)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [Route("product/add")]
        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            try
            {
                _db.Products.Add(product);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            if (product == null)
            {
                return BadRequest();
            }
            return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId }, product);
        }

        [Route("product/delete/{id}")]
        [HttpDelete]
        public IActionResult DeleteProduct([FromRoute] int id)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            _db.Products.Remove(product);

            _db.SaveChanges();

            return Ok(new { message = "Product is deleted" });
        }

        [Route("product/edit/{id}")]
        [HttpPut]
        public IActionResult EditProduct([FromRoute] int id, Product product)
        {
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            _db.Entry(product).State = EntityState.Modified;

            _db.SaveChanges();

            return Ok(new { message = "Product is modifyed" });
        }
    }
}
