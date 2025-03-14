using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NiceApteka.Data;
using NiceApteka.DTO;
using NiceApteka.Models;
using NiceApteka.Services;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly NiceaptekaContext _db;

        private readonly PasswordHasher _passwordHasher = new PasswordHasher();

        public AuthController(NiceaptekaContext db) 
        {
            _db = db;
        }

        [Route("users")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _db.Users.ToList();

            var usersDTO = new List<UserDTOResponse>();

            if (users == null)
            {
                return NotFound();
            }

            foreach (var user in users)
            {
                var userDTO = new UserDTOResponse
                {
                    UserId = user.UserId,
                    Email = user.Email
                };

                usersDTO.Add(userDTO);
            }

            return Ok(usersDTO);
        }

        [Route("user/{id}")]
        [HttpGet]
        public IActionResult GetUserById([FromRoute] int id)
        {
            var user = _db.Users.FirstOrDefault(p => p.UserId == id);
            if (user == null)
            {
                return NotFound();
            }

            var userDTO = new UserDTOResponse
            {
                UserId = user.UserId,
                Email = user.Email
            };

            return Ok(userDTO);
        }

        [Route("userByEmail/{email}")]
        [HttpGet]
        public IActionResult GetUserByEmail([FromRoute] string email)
        {
            var user = _db.Users.FirstOrDefault(p => p.Email == email);
            if (user == null)
            {
                return NotFound();
            }

            var userDTO = new UserDTOResponse
            {
                UserId = user.UserId,
                Email = user.Email,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber
            };

            return Ok(userDTO);
        }

        [Route("register/user")]
        [HttpPost]
        public IActionResult RegisterUser(UserDTORegister userDto)
        {
            if (userDto == null)
            {
                return BadRequest();
            }
            if (!userDto.Email.Contains("@"))
            {
                throw new Exception("В почте отсутствует @");
            }
            if (_db.Users.Any(x => x.Email == userDto.Email))
            {
                throw new Exception("Почта занята");
            }
            if (userDto.PasswordHash.Length < 6)
            {
                throw new Exception("Пароль слишком короткий");
            }
            var user = new User
            {
                UserId = userDto.UserId,
                Email = userDto.Email,
                PasswordHash = _passwordHasher.Generate(userDto.PasswordHash),
                Address = userDto.Address,
                PhoneNumber = userDto.PhoneNumber
            };

            try
            {
                _db.Users.Add(user);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());   
            }

            return CreatedAtAction(nameof(GetUserById), new { id = userDto.UserId }, userDto); 
        }

        [Route("auth/user")]
        [HttpPost]
        public IActionResult AuthUser(UserDTOAuth userDto)
        {
            var person = _db.Users.FirstOrDefault(p => p.Email == userDto.Email);

            
            if (person is null) 
            {
                return BadRequest();
            }

            var isLogged = _passwordHasher.Verify(userDto.PasswordHash, person.PasswordHash);

            if (isLogged == true)
            {
                var claims = new List<Claim> { new Claim(ClaimTypes.Name, person.Email) };
                // создаем JWT-токен
                var jwt = new JwtSecurityToken(
                        issuer: AuthOptions.ISSUER,
                        audience: AuthOptions.AUDIENCE,
                        claims: claims,
                        expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
                        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                // формируем ответ
                var response = new
                {
                    access_token = encodedJwt,
                    username = person.Email
                };
                return Ok(response);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        [Route("user/edit/{email}")] 
        [HttpPut]
        public IActionResult EditUser([FromRoute] string email, [FromBody] UserDTOResponse userDto) 
        {
            // Находим пользователя по email
            var user = _db.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Обновляем только изменяемые поля
            user.Address = userDto.Address;
            user.PhoneNumber = userDto.PhoneNumber;

            _db.SaveChanges();

            return Ok(new { message = "Данные обновлены" });
        }
    }
}
