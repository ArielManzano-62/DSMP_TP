using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Adapters.Auth0Adapter
{
    internal class AuthResponse
    {
        public string AccessToken { get; set; }
        public DateTime ExpiresOn { get; set; }
        public string TokenType { get; set; }
    }
}
