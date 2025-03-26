using NiceApteka.Data;
using NiceApteka.DTO;
using NiceApteka.Models;
using NiceApteka.Services;

namespace NiceApteka.Business.Core;

public class UserManager
{
    private readonly NiceaptekaContext _db;
    
    private readonly PasswordHasher _passwordHasher;

    public UserManager(NiceaptekaContext db, PasswordHasher passwordHasher)
    {
        _db = db;
        _passwordHasher = passwordHasher;
    }
    public UserDTOResponse GetUserById(int id)
    {
        var user = _db.Users.FirstOrDefault(p => p.UserId == id);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var userDTO = new UserDTOResponse
        {
            UserId = user.UserId,
            Email = user.Email
        };

        return userDTO;
    }

    public UserDTOResponse GetUserByEmail(string email)
    {
        var user = _db.Users.FirstOrDefault(p => p.Email == email);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var userDTO = new UserDTOResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Address = user.Address,
            PhoneNumber = user.PhoneNumber
        };

        return userDTO;
    }

    public UserDTORegister RegisterUser(UserDTORegister userDto)
    {
        if (_db.Users.Any(x => x.Email == userDto.Email))
        {
            throw new Exception("Почта занята");
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
            throw new Exception("Ошибка добавления в БД" + ex.Message);  
        }

        return userDto; 
    }

    public User AuthUser(UserDTOAuth userDto)
    {
        var person = _db.Users.FirstOrDefault(p => p.Email == userDto.Email);

        if (person is null)
        {
            throw new Exception("Неверный логин или пароль!");
        }

        var isLogged = _passwordHasher.Verify(userDto.PasswordHash, person.PasswordHash);

        if (isLogged != true)
        {
            throw new Exception("Неверный логин или пароль!");
        }

        return person;
    }

    public string EditUser(string email, UserDTOResponse userDto)
    {
        // Находим пользователя по email
        var user = _db.Users.FirstOrDefault(u => u.Email == email);

        if (user == null)
        {
            throw new Exception("Пользователя с такой почтой не существует!");
        }
        // Обновляем только изменяемые поля
        user.Address = userDto.Address;
        user.PhoneNumber = userDto.PhoneNumber;

        _db.SaveChanges();

        return "Данные изменены";
    }
}