using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NiceApteka.Business.Core;
using NiceApteka.DTO;
using NiceApteka.Models;

namespace NiceApteka.Controllers
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        OrderManager _orderManager;
        
        public OrderController(OrderManager orderManager)
        {
            _orderManager = orderManager;
        }
        
        [Route("order/get/{id}")]
        [HttpGet]
        public IActionResult GetOrderById([FromRoute] int id)
        {
            var response = _orderManager.GetOrderById(id);
            return Ok(response);
        }
        
        [Route("order/{email}")]
        [HttpGet]
        public IActionResult GetOrdersByUserEmail([FromRoute] string email)
        {
            var response = _orderManager.GetOrdersByUserEmail(email);
            return Ok(response);
        }
        
        [Authorize]
        [Route("/order/add")]
        [HttpPost]
        public IActionResult AddOrder([FromBody]OrderDTO orderDto)
        {
            var response = _orderManager.AddOrder(orderDto);
            return Ok(response);
        }

        [HttpPut("order/pay/{orderId}")]
        public IActionResult PayOrder(int orderId)
        {
            var response = _orderManager.PayOrder(orderId);
            return Ok(response);
        }

        [Route("order/delete/{id}")]
        [HttpDelete]
        public IActionResult DeleteOrder([FromRoute] int id)
        {
            var response = _orderManager.DeleteOrder(id);
            return Ok(response);
        }
    }
}
