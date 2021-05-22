using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using static LogicaNegocio.Adapters.PayPalAdapter.PayPalAdapter;

namespace LogicaNegocio
{
    public interface ISubscriptionService
    {
        SubscriptionServiceResponse CreateSuscription(Usuario user);
        SubscriptionStatus GetSubscriptionState(string subscriptionId);
        Task<bool> CancelSubscription(string subscriptionId, string reason);
    }
}
