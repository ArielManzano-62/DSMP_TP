using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.AnalizarWebhook
{
    public class WebhookRequestData
    {

        public string id { get; set; }
        public DateTime create_time { get; set; }
        public string resource_type { get; set; }
        public string event_type { get; set; }
        public string summary { get; set; }
        public WebhookResourceData resource { get; set; }


        public class WebhookResourceData
        {
            public string id { get; set; }
            public string plan_id { get; set; }
        }
    }
}
