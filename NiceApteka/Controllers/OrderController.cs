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

        [Route("order/{id}")]
        [HttpGet]
        public IActionResult GetOrderByUserId([FromRoute] int id)
        {
            var order = _db.Orders.FirstOrDefault(p => p.UserId == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDTO = new OrderDTO
            {
                OrderId = order.OrderId,
                Quantity = order.Quantity,
                Price = order.Price,
                Status = order.Status
            };

            return Ok(orderDTO);
        }

        [Route("order/add")]
        [HttpPost]
        public IActionResult AddOrder([FromBody]OrderDTO orderDto, [FromRoute] int userId)
        {
            if (orderDto == null)
            {
                return BadRequest();
            }

            var order = new Order
            {
                UserId = userId,
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
                Console.WriteLine(ex.ToString());
            }
            
            return CreatedAtAction(nameof(GetOrderByUserId), new { id = orderDto.OrderId }, orderDto);
        }
    }
}
