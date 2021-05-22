using Auth0.ManagementApi;
using Auth0.ManagementApi.Models;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Adapters.Auth0Adapter
{
    public class AuthAdapter : IIdentityProvider
    {
        private static readonly string URL = "https://closely.auth0.com/api/v2";
        private static AuthResponse TOKEN;
        private static ManagementApiClient API;

        public AuthAdapter()
        {
            GetToken();
        }

        public void CreateUser(string email, string password, string nombre, string apellido)
        {
            GetToken();
            User usuario = API.Users.CreateAsync(
                new UserCreateRequest
                {
                    Email = email,
                    Connection = "Username-Password-Authentication",
                    Password = password,
                    FirstName = nombre,
                    LastName = apellido,
                    FullName = nombre + " " + apellido,
                    AppMetadata = new
                    {
                        registeredInDb = false
                    }
                }).Result;

        }

        public async Task<bool> UserExistByEmail(string email)
        {
            GetToken();
            return (await API.Users.GetUsersByEmailAsync(email)).Count > 0;
        }

        public async Task UpdateUser(string userId, string name, string lastname, string picture)
        {
            GetToken();
            dynamic userMetadata = new ExpandoObject();
            if (name != "" && name != null)
                userMetadata.given_name = name;
            if (lastname != "" && lastname != null)
                userMetadata.family_name = lastname;
            if (picture != "" && picture != null)
                userMetadata.picture = picture;

            var user = await API.Users.UpdateAsync(userId, new UserUpdateRequest
            {
                UserMetadata = userMetadata
            });
            Console.WriteLine(user.UserMetadata);
        }



        private void GetToken()
        {
            if (TOKEN == null || 0 > DateTime.Compare(TOKEN.ExpiresOn, DateTime.Now.AddMinutes(5.0)))
            {
                var client = new RestClient("https://closely.auth0.com/oauth/token");
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/x-www-form-urlencoded");
                request.AddParameter("application/x-www-form-urlencoded", "grant_type=client_credentials&client_id=ckFSLyB5W04YvRlM0kAwqMKsXwyzg6Fh&client_secret=KUwK9dnzApHo3l8tSRi_Pc9TFwoXqly0c5dSkSJG3Avc-yFJqCbRdSOgO_BKa0Rh&audience=https://closely.auth0.com/api/v2/", ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
                dynamic data = JObject.Parse(response.Content);
                var token = new AuthResponse();
                token.AccessToken = data.access_token;
                token.ExpiresOn = DateTime.Now.AddSeconds((double)data.expires_in);
                token.TokenType = data.token_type;
                TOKEN = token;
                API = new ManagementApiClient(TOKEN.AccessToken, new Uri(URL));
            }
        }
    }
}
