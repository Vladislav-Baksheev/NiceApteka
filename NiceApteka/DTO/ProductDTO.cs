using System;
using System.Collections.Generic;

namespace NiceApteka.DTO;

public partial class ProductDTO
{
    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int QuantityInStock { get; set; }

    public string? ImageUrl { get; set; }
}
