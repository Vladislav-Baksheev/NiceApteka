using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NiceApteka.Business.Core;
using NiceApteka.DTO;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class ProductController : ControllerBase
    {
        ProductManager _productManager;
        
        public ProductController(ProductManager productManager)
        {
            _productManager = productManager;
        }

        [Route("products")]
        [HttpGet]
        public Task<ActionResult> GetProducts()
        {
            var response = _productManager.GetProducts();
            return Task.FromResult<ActionResult>(Ok(response));
        }

        [Route("product/{id}")]
        [HttpGet]
        public IActionResult GetProductById([FromRoute] int id)
        {
            var response = _productManager.GetProductById(id);
            return Ok(response);
        }

        [Authorize(Roles = "admin")]
        [Route("product/add")]
        [HttpPost]
        public IActionResult AddProduct(ProductDTO productDto)
        {
            var response = _productManager.AddProduct(productDto);
            return CreatedAtAction(nameof(GetProductById), new { id = productDto.ProductId }, productDto);
        }

        [Authorize(Roles = "admin")]
        [Route("product/delete/{id}")]
        [HttpDelete]
        public IActionResult DeleteProduct([FromRoute] int id)
        {
            var response = _productManager.DeleteProduct(id);
            return Ok(response);
        }

        [Authorize(Roles ="admin")]
        [Route("product/edit/{id}")]
        [HttpPut]
        public IActionResult EditProduct([FromRoute] int id, [FromBody]ProductDTO productDto)
        {
            var response = _productManager.EditProduct(id, productDto);
            return Ok(response);
        }
    }
}
