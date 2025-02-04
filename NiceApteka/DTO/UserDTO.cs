using System;
using System.Collections.Generic;

namespace NiceApteka.Models;

public partial class UserDTO
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;
}
