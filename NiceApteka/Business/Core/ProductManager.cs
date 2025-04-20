using NiceApteka.Data;
using NiceApteka.DTO;
using NiceApteka.Models;

namespace NiceApteka.Business.Core;

public class ProductManager
{
    private readonly NiceaptekaContext _db;
    
    public ProductManager(NiceaptekaContext db)
    {
        _db = db;
    }

    public List<ProductDTO> GetProducts()
    {
        var products = _db.Products.ToList();

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
        
        return productsDTO;
    }

    public ProductDTO GetProductById(int id)
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
        
        return productDTO;
    }

    public Product AddProduct(ProductDTO productDto)
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
        
        return product;
    }

    public Product DeleteProduct(int id)
    {
        var product = _db.Products.FirstOrDefault(p => p.ProductId == id);

        if (product == null)
        {
            throw new Exception("Товар не найден!");
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
        
        return product;
    }

    public Product EditProduct(int id, ProductDTO productDto)
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

        return product;
    }
}