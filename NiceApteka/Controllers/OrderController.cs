using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using NiceApteka.Data;
using NiceApteka.DTO;
using NiceApteka.Models;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly NiceaptekaContext _db;
        public OrderController(NiceaptekaContext db)
        {
            _db = db;
        }

        [Route("order/{email}")]
        [HttpGet]
        public IActionResult GetOrdersByUserEmail([FromRoute] string email)
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

            return Ok(ordersDTO);
        }
        
        [Authorize]
        [Route("/order/add")]
        [HttpPost]
        public IActionResult AddOrder([FromBody]OrderDTO orderDto)
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
            }
            catch (Exception ex)
            {
                throw new Exception("Ошибка добавления товара!");
            }
            
            return CreatedAtAction(nameof(AddOrder), new { id = orderDto.OrderId }, orderDto);
        }

        [HttpPut("order/pay/{orderId}")]
        public IActionResult PayOrder(int orderId)
        {
            var order = _db.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
            {
                throw new Exception("Заказ не найден");
            }

            // Обновляем статус заказа
            order.Status = "Оплачен";
            _db.SaveChanges();

            return Ok(new { message = "Заказ успешно оплачен" });
        }

        [Route("order/delete/{id}")]
        [HttpDelete]
        public IActionResult DeleteOrder([FromRoute] int id)
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


            return Ok(new { message = "Заказ удален!" });
        }
    }
}
