using System;
using System.Collections.Generic;

namespace NiceApteka.DTO;

public partial class UserDTOAuth
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

}
