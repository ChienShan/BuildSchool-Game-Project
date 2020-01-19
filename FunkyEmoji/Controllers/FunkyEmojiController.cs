using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace FunkyEmoji.Controllers
{
    public class FunkyEmojiController : Controller
    {
        public IActionResult GameRoom()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}