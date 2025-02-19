using System;
using System.Collections.Generic;

namespace NiceApteka.DTO;

public partial class UserDTOResponse
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;
}
