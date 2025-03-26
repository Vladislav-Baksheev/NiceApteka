using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NiceApteka.DTO;
using NiceApteka.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using NiceApteka.Business.Core;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager _userManager;
        
        public AuthController(UserManager userManager) 
        {
            _userManager = userManager;
        }

        [Route("user/{id}")]
        [HttpGet]
        public IActionResult GetUserById([FromRoute] int id)
        {
            var user = _userManager.GetUserById(id);
            return Ok(user);
        }

        [Route("userByEmail/{email}")]
        [HttpGet]
        public IActionResult GetUserByEmail([FromRoute] string email)
        {
            var user = _userManager.GetUserByEmail(email);
            return Ok(user);
        }

        [Route("register/user")]
        [HttpPost]
        public IActionResult RegisterUser(UserDTORegister userDto)
        {
            var user = _userManager.RegisterUser(userDto);
            return CreatedAtAction(nameof(GetUserById), new { id = user.UserId }, user); 
        }

        [Route("auth/user")]
        [HttpPost]
        public IActionResult AuthUser(UserDTOAuth userDto)
        {
            var person = _userManager.AuthUser(userDto);

            var claims = new List<Claim> 
            { 
                new Claim(ClaimTypes.Name, person.Email),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, person.Role)
            };
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(60)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                username = person.Email,
                role = person.Role
            };
            return Ok(response);
        }
        
        [Authorize]
        [Route("user/edit/{email}")] 
        [HttpPut]
        public IActionResult EditUser([FromRoute] string email, [FromBody] UserDTOResponse userDto) 
        {
            var response = _userManager.EditUser(email, userDto);
            return Ok(response);
        }
    }
}
