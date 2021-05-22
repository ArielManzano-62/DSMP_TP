using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio
{
    public class SubscriptionServiceResponse
    {
        public string Id { get; set; }
        public string Estado { get; set; }
        public DateTime FechaHoraCreacion { get; set; }
        public string ApproveLink { get; set; }
    }
}
