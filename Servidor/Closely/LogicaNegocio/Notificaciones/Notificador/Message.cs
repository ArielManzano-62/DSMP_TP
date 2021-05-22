using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Notificaciones.Notificador
{
    public class Message
    {
        public string[] registration_ids { get; set; }
        public Notification notification { get; set; }
        public object data { get; set; }
        public object android { get; set; }

        public class Notification
        {
            public string title { get; set; }
            public string text { get; set; }
            public string click_action { get; set; }
        }
    }
}
