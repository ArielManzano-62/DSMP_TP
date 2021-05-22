using Dominio.Usuarios;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Adapters.PayPalAdapter
{
    public class PayPalAdapter : ISubscriptionService
    {
        public enum SubscriptionStatus
        {
            NULL,
            APPROVAL_PENDING,
            APPROVED,
            ACTIVE,
            SUSPENDED,
            CANCELLED,
            EXPIRED
        }
       
        private static string URL = "https://api.sandbox.paypal.com/v1";
        private static string TOKEN;
        private static string USERNAME = "AXV8bt-jq-Zge5eXkGSrBN4FiB7Oy4C-b5fHqRsqeVUjxr3Ek5Fb8cYhjDB7mk2O4wHFrPgRVqshYrbb";
        private static string PASSWORD = "EP5Tjs3VnvExHHzeYHlwiYnQ-c2yZELW1C3i_kC9xoRsrQ6pKiimaQ-sr8jfUbyQk6HnM8LAG59zHPZL";

        public PayPalAdapter()
        {
            GetToken();
        }

        public SubscriptionServiceResponse CreateSuscription(Usuario user)
        {
            if (user == null) throw new ArgumentNullException("User fue null");
            var url = URL + "/billing/subscriptions";
            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", TOKEN);
            request.AddHeader("content-type", "application/json");
            request.AddJsonBody(new
            {
                plan_id = "P-97U865220K223940XLWXA53Y",
                subscriber = new
                {
                    name = new
                    {
                        given_name = user.Nombre,
                        surname = user.Apellido
                    },
                    email_address = user.Email
                },
                application_context = new
                {
                    brand_name = "Closely",
                    locale = "es-AR",
                    shipping_preference = "NO_SHIPPING",
                    return_url = "http://www.4closely.com/success.html",
                    cancel_url = "http://www.4closely.com/cancel.html"

                }
            });
            
            IRestResponse response = client.Execute(request);
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                GetToken();
                CreateSuscription(user);
            }

            dynamic data = JObject.Parse(response.Content);
            ICollection<dynamic> links = data.links.ToObject<List<dynamic>>();

            return new SubscriptionServiceResponse
            {
                Id = data.id,
                Estado = data.status,
                FechaHoraCreacion = data.create_time,
                ApproveLink = links.First(l => l.rel == "approve").href
            };

        }

        public async Task<bool> CancelSubscription(string subscriptionId, string reason)
        {
            if (String.IsNullOrEmpty(subscriptionId)) throw new ArgumentNullException(paramName: "subscriptionId", message: "Param fue null");
            if (String.IsNullOrEmpty(reason)) throw new ArgumentNullException(paramName: "reason", message: "Param fue null");
            var url = URL + $"/billing/subscriptions/{subscriptionId}/cancel";
            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", TOKEN);
            request.AddHeader("content-type", "application/json");
            request.AddJsonBody(new
            {
                reason
            });

            IRestResponse response = await client.ExecuteTaskAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                GetToken();
                await CancelSubscription(subscriptionId, reason);
            } 
            else if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return true;
            }
            return false;
        }

        public SubscriptionStatus GetSubscriptionState(string subscriptionId)
        {
            if (subscriptionId == "" || subscriptionId == null) throw new ArgumentException("SubscriptionId fue null");
            var url = URL + "/billing/subscriptions/" + subscriptionId;
            var client = new RestClient(url);
            var request = new RestRequest(Method.GET);
            request.AddHeader("Authorization", TOKEN);

            IRestResponse response = client.Execute(request);
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                GetToken();
                GetSubscriptionState(subscriptionId);
            }

            dynamic data = JObject.Parse(response.Content);
            Console.WriteLine(data.status);
            var status = data.status;
            if (status == "APPROVAL_PENDING")
                return SubscriptionStatus.APPROVAL_PENDING;
            else if (status == "APPROVED")
                return SubscriptionStatus.APPROVED;
            else if (status == "ACTIVE")
                return SubscriptionStatus.ACTIVE;
            else if (status == "SUSPENDED")
                return SubscriptionStatus.SUSPENDED;
            else if (status == "CANCELLED")
                return SubscriptionStatus.CANCELLED;
            else
                return SubscriptionStatus.NULL;

        }

        private void GetToken()
        {
            var url = URL + "/oauth2/token";
            var client = new RestClient(url);
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/x-www-form-urlencoded");
            string svcCredentials = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(USERNAME + ":" + PASSWORD));
            request.AddHeader("Authorization", "Basic " + svcCredentials);

            request.AddParameter("grant_type", "client_credentials");
            IRestResponse response = client.Execute(request);
            dynamic data = JObject.Parse(response.Content);
            TOKEN = $"{data.token_type} {data.access_token}";



        }


    }
}
