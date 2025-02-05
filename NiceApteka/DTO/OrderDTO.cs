using System;
using System.Collections.Generic;

namespace NiceApteka.DTO;

public partial class OrderDTO
{
    public int OrderId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }
}
