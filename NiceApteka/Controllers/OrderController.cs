using Microsoft.AspNetCore.Mvc;
using NiceApteka.Data;
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
            if (orders == null)
            {
                return NotFound();
            }
            return Ok(orders);
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
            return Ok(order);
        }

        [Route("order/add")]
        [HttpPost]
        public IActionResult AddOrder(Order order)
        {
            if (order == null)
            {
                return BadRequest();
            }
            try
            {
                _db.Orders.Add(order);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            
            return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
        }
    }
}
