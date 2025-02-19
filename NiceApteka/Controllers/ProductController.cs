﻿using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetProducts()
        {
            var products = _db.Products.ToList();

            var productsDTO = new List<ProductDTO>();

            if (products == null)
            {
                return NotFound();
            }

            foreach (var product in products)
            {
                var productDTO = new ProductDTO
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    QuantityInStock = product.QuantityInStock,
                    ImageUrl = product.ImageUrl
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
                return NotFound();
            }

            var productDTO = new ProductDTO
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                QuantityInStock = product.QuantityInStock,
                ImageUrl = product.ImageUrl
            };

            return Ok(productDTO);
        }

        [Route("product/add")]
        [HttpPost]
        public IActionResult AddProduct(ProductDTO productDto)
        {
            if (productDto == null)
            {
                return BadRequest();
            }

            var product = new Product
            {
                ProductId = productDto.ProductId,
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                QuantityInStock = productDto.QuantityInStock,
                ImageUrl = productDto.ImageUrl
            };

            try
            {
                _db.Products.Add(product);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            
            return CreatedAtAction(nameof(GetProductById), new { id = productDto.ProductId }, productDto);
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

            try
            {
                _db.Products.Remove(product);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            

            return Ok(new { message = "Product is deleted" });
        }

        [Route("product/edit/{id}")]
        [HttpPut]
        public IActionResult EditProduct([FromRoute] int id, ProductDTO productDto)
        {
            if (productDto == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            var product = new Product
            {
                ProductId = productDto.ProductId,
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                QuantityInStock = productDto.QuantityInStock,
                ImageUrl = productDto.ImageUrl
            };

            _db.Entry(product).State = EntityState.Modified;

            _db.SaveChanges();

            return Ok(new { message = "Product is modifyed" });
        }
    }
}
