using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace FunkyEmoji.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendScore(string user, string score)
        {
            await Clients.Others.SendAsync("ReceiveScore", user, score);
        }

        public async Task SendSubject( string emoji, string time)
        {
            await Clients.Others.SendAsync("ReceiveSubject",  emoji, time);
        }

        //public async Task AddGroup(string groupName, string user)
        //{
        //    //群組名字暫時固定為TestGroup
        //    await Groups.AddToGroupAsync(Context.ConnectionId, "TestGroup");
        //    await Clients.All.SendAsync("RecGroupMsg", $"{user}已加入 群組:TestGroup");
        //}

        //public Task ReceiveMsgGroup(string groupName, string user, string message)
        //{
        //    return Clients.Group("TestGroup").SendAsync("ReceiveMessageGroup", "TestGroup", user, message);
        //}
    }
}