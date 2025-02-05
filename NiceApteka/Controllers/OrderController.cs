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

        [Route("orders")]
        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = _db.Orders.ToList();

            var ordersDTO = new List<OrderDTO>();

            if (orders == null)
            {
                return NotFound();
            }

            foreach (var order in orders)
            {
                var orderDTO = new OrderDTO
                {
                    OrderId = order.OrderId,
                    Quantity = order.Quantity,
                    Price = order.Price,
                    Status = order.Status,
                    CreatedAt = order.CreatedAt
                };

                ordersDTO.Add(orderDTO);
            }

            return Ok(ordersDTO);
        }

        [Route("order/{id}")]
        [HttpGet]
        public IActionResult GetOrderById([FromRoute] int id)
        {
            var order = _db.Orders.FirstOrDefault(p => p.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDTO = new OrderDTO
            {
                OrderId = order.OrderId,
                Quantity = order.Quantity,
                Price = order.Price,
                Status = order.Status,
                CreatedAt = order.CreatedAt
            };

            return Ok(orderDTO);
        }

        [Route("order/add")]
        [HttpPost]
        public IActionResult AddOrder(OrderDTO orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest();
            }

            var order = new Order
            {
                OrderId = orderDto.OrderId,
                Quantity = orderDto.Quantity,
                Price = orderDto.Price,
                Status = orderDto.Status,
                CreatedAt = orderDto.CreatedAt
            };

            try
            {
                _db.Orders.Add(order);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            
            return CreatedAtAction(nameof(GetOrderById), new { id = orderDto.OrderId }, orderDto);
        }
    }
}
