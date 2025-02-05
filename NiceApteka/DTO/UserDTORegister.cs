using System;
using System.Collections.Generic;

namespace NiceApteka.DTO;

public partial class UserDTORegister
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }
}
