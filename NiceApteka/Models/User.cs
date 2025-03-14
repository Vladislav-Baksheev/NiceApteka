using System;
using System.Collections.Generic;

namespace NiceApteka.Models;

public partial class User
{
    public int UserId { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }

    public string Role { get; set; } = "user";

    public DateTime? CreatedAt { get; set; } = DateTime.Now.ToUniversalTime();

    public virtual ICollection<Order>? Orders { get; set; } = new List<Order>();
}
