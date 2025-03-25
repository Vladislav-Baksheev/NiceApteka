using System.ComponentModel.DataAnnotations;

namespace NiceApteka.DTO;

public partial class UserDTOAuth
{
    public int UserId { get; set; }
    
    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [MinLength(6)]
    public string PasswordHash { get; set; } = null!;

}
