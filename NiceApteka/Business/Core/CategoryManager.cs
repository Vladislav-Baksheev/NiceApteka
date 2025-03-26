using NiceApteka.Data;
using NiceApteka.DTO;

namespace NiceApteka.Business.Core;

public class CategoryManager
{
    private readonly NiceaptekaContext _db;
    
    public CategoryManager(NiceaptekaContext db)
    {
        _db = db;
    }

    public List<CategoryDTO> GetCategories()
    {
        var categories = _db.Categories.ToList();

        var categoriesDTO = new List<CategoryDTO>();

        foreach (var category in categories)
        {
            var categoryDTO = new CategoryDTO
            {
                CategoryId = category.CategoryId,
                Name = category.Name
            };

            categoriesDTO.Add(categoryDTO);
        }

        return categoriesDTO;
    }
}