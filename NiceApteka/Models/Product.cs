using System;
using System.Collections.Generic;

namespace NiceApteka.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int QuantityInStock { get; set; }

    public string? ImageUrl { get; set; }

    public int? CategoryId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
}
