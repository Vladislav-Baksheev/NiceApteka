using Microsoft.AspNetCore.Mvc;
using NiceApteka.Business.Core;
using NiceApteka.DTO;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class CategoryController : ControllerBase
    {
        CategoryManager _categoryManager;

        public CategoryController(CategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        [Route("categories")]
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _categoryManager.GetCategories();

            return Ok(categories);
        }
    }
}
