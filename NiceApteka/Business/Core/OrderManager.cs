using NiceApteka.Data;
using NiceApteka.DTO;
using NiceApteka.Models;

namespace NiceApteka.Business.Core;

public class OrderManager
{
    private readonly NiceaptekaContext _db;
    
    public OrderManager(NiceaptekaContext db)
    {
        _db = db;
    }

    public Order GetOrderById(int id)
    {
        var order = _db.Orders.FirstOrDefault(u => u.OrderId == id);

        if (order == null)
        {
            return null;
        }
        
        return order;
    }

    public List<OrderDTO> GetOrdersByUserEmail(string email)
    {
        var user = _db.Users.FirstOrDefault(u => u.Email == email);

        if (user == null)
        {
            throw new Exception("Пользователя с такой почтой нет!");
        }
            
        var orders = _db.Orders.Where(p => p.UserId == user.UserId).ToList();
            
        List<OrderDTO> ordersDTO = new();

        foreach(var order in orders)
        {
            var orderItem = new OrderDTO
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Price = order.Price,
                Status = order.Status
            };

            ordersDTO.Add(orderItem);
        }
        return ordersDTO;
    }

    public OrderDTO AddOrder(OrderDTO orderDto)
    {
        var order = new Order
        {
            UserId = orderDto.UserId,
            ProductId = orderDto.ProductId,
            Quantity = orderDto.Quantity,
            Price = orderDto.Price,
            Status = orderDto.Status
        };

        try
        {
            _db.Orders.Add(order);
            _db.SaveChanges();
            return orderDto;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public string PayOrder(int orderId)
    {
        var order = _db.Orders.FirstOrDefault(o => o.OrderId == orderId);
        if (order == null)
        {
            throw new Exception("Заказ не найден");
        }

        // Обновляем статус заказа
        order.Status = "Оплачен";
        _db.SaveChanges();

        return "Заказ успешно оплачен";
    }

    public string DeleteOrder(int id)
    {
        var order = _db.Orders.FirstOrDefault(p => p.OrderId == id);

        if (order == null)
        {
            throw new Exception("Заказ не найден");
        }

        try
        {
            _db.Orders.Remove(order);
            _db.SaveChanges();
        }
        catch
        {
            throw new Exception("Ошибка удаления заказа!");
        }
        return "Заказ удален!";
    }
}