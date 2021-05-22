using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Notificaciones.Notificador
{
    public class FcmInterface
    {
        private static string FirebaseURL = "https://fcm.googleapis.com/fcm/send";
        private static string ServerKey = "AAAA-yPk_k4:APA91bEmNNnkQz7p0eXpR3224XOJh9rQy6dmUfEXlvHQUN9sXQjC6CezOj3eQqvuS7FZRrgF6W2oBvE9iifMfxbssELtpojjGFwPHbqVrJqV0LS0IC1UD0b3nl7o4hTQFwfsoakOIPGW";

        public static async Task<bool> SendPushNotification(Message msg)
        {
            if (msg == null)
            {
                return false;
            }

            var jsonMessage = JsonConvert.SerializeObject(msg);
            var request = new HttpRequestMessage(HttpMethod.Post, FirebaseURL);
            request.Headers.TryAddWithoutValidation("Authorization", "key=" + ServerKey);
            request.Content = new StringContent(jsonMessage, Encoding.UTF8, "application/json");
            HttpResponseMessage result;
            using (var client = new HttpClient())
            {
                result = await client.SendAsync(request);
                return true;
            }
        }
    }
}

