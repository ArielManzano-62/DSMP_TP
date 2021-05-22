using LogicaNegocio.Repositorio;
using LogicaNegocio.Usuarios.AnalizarWebhook.Strategies;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.AnalizarWebhook
{
    public class AnalizarWebhookInteractor : IAnalizarWebhookInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public AnalizarWebhookInteractor(IUnitOfWork repositorio) 
        {
            _repositorio = repositorio;
        }

        public Task Analizar(WebhookRequestData data)
        {
            if (data == null) throw new ArgumentException(paramName: "data", message: "La data del webhook fue null");

            ISuscriptionWebhookStrategy webhookStrategy = null;

            switch (data.event_type)
            {
                case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
                    webhookStrategy = new PaymentFailedStrategy();
                    break;
                case "BILLING.SUBSCRIPTION.CANCELLED":
                    webhookStrategy = new SuscriptionCanceledStrategy();
                    break;
                case "BILLING.SUBSCRIPTION.ACTIVATED":
                    webhookStrategy = new SubscriptionActivatedStrategy();
                    break;
            }

            return webhookStrategy?.Execute(data.resource.id, _repositorio);
        }
    }
}
