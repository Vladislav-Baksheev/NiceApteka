using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NiceApteka.DTO;

public partial class UserDTORegister
{
    public int UserId { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [MinLength(6)]
    public string PasswordHash { get; set; } = null!;

    public string? Address { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }
}
