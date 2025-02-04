using Microsoft.AspNetCore.Mvc;
using NiceApteka.Data;
using NiceApteka.Models;
using System;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly NiceaptekaContext _db;

        public AuthController(NiceaptekaContext db) 
        {
            _db = db;
        }

        [Route("auth/users")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _db.Users.ToList();

            var usersDTO = new List<UserDTO>();

            if (users == null)
            {
                return NotFound();
            }

            foreach (var user in users)
            {
                var userDTO = new UserDTO
                {
                    UserId = user.UserId,
                    Email = user.Email
                };

                usersDTO.Add(userDTO);
            }

            return Ok(usersDTO);
        }

        [Route("auth/users/{id}")]
        [HttpGet]
        public IActionResult GetUserById([FromRoute] int id)
        {
            var user = _db.Users.FirstOrDefault(p => p.UserId == id);
            if (user == null)
            {
                return NotFound();
            }

            var userDTO = new UserDTO
            {
                UserId = user.UserId,
                Email = user.Email
            };

            return Ok(userDTO);
        }

        [Route("auth/users/register")]
        [HttpPost]
        public IActionResult RegisterUser(User user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            try
            {
                _db.Users.Add(user);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());   
            }
            
            return CreatedAtAction(nameof(GetUserById), new { id = user.UserId }, user); 
        }

        [Route("auth/users/auth")]
        [HttpPost]
        public IActionResult AuthUser(User user)
        {
            var person = _db.Users.FirstOrDefault(p => p.Email == user.Email && p.PasswordHash == user.PasswordHash);

            if (person is null) return Unauthorized();

            var response = new
            {
                username = person.Email 
            };

            return Ok(response);
        }
    }
}
