using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using MailKit.Net.Smtp;
using MimeKit;

namespace LogicaNegocio.Usuarios.AnalizarWebhook.Strategies
{
    public class SuscriptionCanceledStrategy : ISuscriptionWebhookStrategy
    {
        public async Task Execute(string suscripcionId, IUnitOfWork repositorio)
        {
            var suscription = repositorio.Suscripciones.Get(suscripcionId);

            try
            {
                suscription.Cancelar("Desconocido");
            } catch (InvalidOperationException) { }
            

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

            emailMessage.Subject = "Ha Cancelado su Suscripción";

            emailMessage.Body = new TextPart("plain")
            {
                Text = $@"Señor/a {userConSuscripcion.Nombre} {userConSuscripcion.Apellido},

Se le ha dado de baja su suscripción a Closely con éxito.

Muchas gracias por haber formado parte. Esperamos volver a verlo pronto.

-- Equipo de Closely."
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
