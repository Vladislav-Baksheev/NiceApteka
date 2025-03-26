using Microsoft.AspNetCore.Mvc;
using NiceApteka.Data;
using NiceApteka.DTO;
using NiceApteka.Models;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly NiceaptekaContext _db;

        public CategoryController(NiceaptekaContext db)
        {
            _db = db;
        }

        [Route("categories")]
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _db.Categories.ToList();

            var categoriesDTO = new List<CategoryDTO>();

            if (categories == null)
            {
                return NotFound();
            }

            foreach (var category in categories)
            {
                var categoryDTO = new CategoryDTO
                {
                    CategoryId = category.CategoryId,
                    Name = category.Name
                };

                categoriesDTO.Add(categoryDTO);
            }

            return Ok(categoriesDTO);
        }

        [Route("category/{id}")]
        [HttpGet]
        public IActionResult GetCategoryById([FromRoute] int id)
        {
            var category = _db.Categories.FirstOrDefault(p => p.CategoryId == id);

            if (category == null)
            {
                return NotFound();
            }

            var categoryDTO = new CategoryDTO
            {
                CategoryId = category.CategoryId,
                Name = category.Name
            };

            return Ok(categoryDTO);
        }
    }
}
