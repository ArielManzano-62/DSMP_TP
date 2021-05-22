using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using LogicaNegocio.Repositorio;
using MailKit.Net.Smtp;
using MimeKit;

namespace LogicaNegocio.Usuarios.AnalizarWebhook.Strategies
{
    public class SubscriptionActivatedStrategy : ISuscriptionWebhookStrategy
    {
        public Task Execute(string suscripcionId, IUnitOfWork repositorio)
        {
            var suscripcion = repositorio.Suscripciones.Get(suscripcionId);
            if (suscripcion == null) return Task.CompletedTask;
            
            suscripcion.Aprobar();
            repositorio.Suscripciones.Update(suscripcion);
            repositorio.Complete();
            return Task.CompletedTask;

            
        }
    }
}
