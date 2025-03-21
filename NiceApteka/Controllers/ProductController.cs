using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NiceApteka.Data;
using NiceApteka.DTO;
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
        public async Task<ActionResult> GetProducts()
        {
            var products = await _db.Products.ToListAsync();

            var productsDTO = new List<ProductDTO>();

            foreach (var product in products)
            {
                var productDTO = new ProductDTO
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    QuantityInStock = product.QuantityInStock,
                    ImageUrl = product.ImageUrl,
                    CategoryId = product.CategoryId
                };

                productsDTO.Add(productDTO);
            }

            return Ok(productsDTO);
        }

        [Route("product/{id}")]
        [HttpGet]
        public IActionResult GetProductById([FromRoute] int id)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (product == null)
            {
                throw new Exception("Товар не найден!");
            }

            var productDTO = new ProductDTO
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                QuantityInStock = product.QuantityInStock,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId
            };

            return Ok(productDTO);
        }

        [Authorize(Roles = "admin")]
        [Route("product/add")]
        [HttpPost]
        public IActionResult AddProduct(ProductDTO productDto)
        {
            var product = new Product
            {
                ProductId = productDto.ProductId,
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                QuantityInStock = productDto.QuantityInStock,
                ImageUrl = productDto.ImageUrl,
                CategoryId = productDto.CategoryId
            };

            try
            {
                _db.Products.Add(product);
                _db.SaveChanges();
            }
            catch
            {
                throw new Exception("Ошибка добавления товара!");
            }
            
            return CreatedAtAction(nameof(GetProductById), new { id = productDto.ProductId }, productDto);
        }

        [Authorize(Roles = "admin")]
        [Route("product/delete/{id}")]
        [HttpDelete]
        public IActionResult DeleteProduct([FromRoute] int id)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);

            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            try
            {
                _db.Products.Remove(product);
                _db.SaveChanges();
            }
            catch
            {
                throw new Exception("Ошибка удаления товара!");
            }
            

            return Ok(new { message = "Товар удален!" });
        }

        [Authorize(Roles ="admin")]
        [Route("product/edit/{id}")]
        [HttpPut]
        public IActionResult EditProduct([FromRoute] int id, [FromBody]ProductDTO productDto)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);

            if (product == null)
            {
                throw new Exception("Товар не найден!");
            }

            // Обновление полей
            product.Name = productDto.Name;
            product.Price = productDto.Price;
            product.Description = productDto.Description;
            product.ImageUrl = productDto.ImageUrl;
            product.CategoryId = productDto.CategoryId;

            _db.SaveChanges();

            return Ok(new { message = "Товар изменен!" });
        }
    }
}
