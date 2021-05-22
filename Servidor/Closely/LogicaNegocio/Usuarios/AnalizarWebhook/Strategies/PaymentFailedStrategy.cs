using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.AnalizarWebhook.Strategies
{
    public class PaymentFailedStrategy : ISuscriptionWebhookStrategy
    {
        public async Task Execute(string suscripcionId, IUnitOfWork repositorio)
        {
            var suscription = repositorio.Suscripciones.Get(suscripcionId);
            if (suscription.EstaCancelada()) throw new Exception(message: "Ya estaba cancelada, algo anduvo mal");

            suscription.Cancelar("Falta de Pago");

            var usuarios = repositorio.Usuarios.GetAllWithSuscripciones();
            Usuario userConSuscripcion = null;

            foreach (Usuario u in usuarios)
            {
                if (u.Suscripciones.Contains(suscription))
                {
                    userConSuscripcion = u;
                    break;
                }                    
            }

            if (userConSuscripcion == null) throw new Exception(message: "La suscripcion no pertenecia a nadie. Raro");

            repositorio.Suscripciones.Update(suscription);
            repositorio.Complete();

            //Generar Email
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress("Closely", "4closely@gmail.com"));

            emailMessage.To.Add(new MailboxAddress(userConSuscripcion.Email));

            emailMessage.Subject = "Baja por Falta de Pago";

            emailMessage.Body = new TextPart("plain") 
            {
                Text = $@"Señor/a {userConSuscripcion.Nombre} {userConSuscripcion.Apellido},
Se le notifica que se ha dado de baja su suscripcion a Closely automáticamente.

Razón: Falta de Pago

-- Gracias por haber sido parte de Closely."
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync("4closely@gmail.com", "Diamondbad1234");
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
        }
    }
}
