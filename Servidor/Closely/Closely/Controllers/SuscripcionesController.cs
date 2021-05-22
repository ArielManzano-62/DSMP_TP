using LogicaNegocio.Usuarios.AnalizarWebhook;
using LogicaNegocio.Usuarios.AprobarSuscripcion;
using LogicaNegocio.Usuarios.CancelarSuscripcion;
using LogicaNegocio.Usuarios.ConsultarEstadoSuscripcion;
using LogicaNegocio.Usuarios.Suscribir;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System;
using System.Threading.Tasks;

namespace Closely.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SuscripcionesController : ControllerBase
    {
        private readonly ISuscripcionUsuarioInteractor _interactorCrearSuscripcion;
        private readonly IAprobarSuscripcionInteractor _interactorAprobarSuscripcion;
        private readonly IConsultarSuscripcionActivaInteractor _interactorConsultarSuscripcionActiva;
        private readonly ICancelarSuscripcionInteractor _interactorCancelarSuscripcion;
        private readonly IAnalizarWebhookInteractor _interactorAnalizarWebhook;

        public SuscripcionesController(
            ISuscripcionUsuarioInteractor interactorCrearSuscripcion,
            IAprobarSuscripcionInteractor interactorAprobarSuscripcion,
            IConsultarSuscripcionActivaInteractor interactorConsultarSuscripcionActiva,
            ICancelarSuscripcionInteractor interactorCancelarSuscripcion,
            IAnalizarWebhookInteractor interactorAnalizarWebhook)
        {
            _interactorCrearSuscripcion = interactorCrearSuscripcion;
            _interactorAprobarSuscripcion = interactorAprobarSuscripcion;
            _interactorConsultarSuscripcionActiva = interactorConsultarSuscripcionActiva;
            _interactorCancelarSuscripcion = interactorCancelarSuscripcion;
            _interactorAnalizarWebhook = interactorAnalizarWebhook;
        }

        [HttpGet]
        public ActionResult EstadoSuscripcion()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var usuarioId = claim.Value;
            try
            {
                var res = _interactorConsultarSuscripcionActiva.Consultar(usuarioId);
                if (res) return Ok();
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Algo Salio Mal");
            }
        }

        [HttpPost]
        public ActionResult CrearSuscripcion()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var usuarioId = claim.Value;
            try
            {
                var output = _interactorCrearSuscripcion.Subscribir(usuarioId);
                return Ok(output);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpPost("cancelar")]
        public async Task<ActionResult> CancelarSuscripcion(CancelarSuscripcionInput input)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier")); 
            var usuarioId = claim.Value;
            try
            {
                await _interactorCancelarSuscripcion.Cancelar(usuarioId, input.Motivo);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return BadRequest("Debe ingresar motivo de cancelación");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("La cancelación no se pudo procesar. Intente nuevamente más tarde");
            }
            catch (Exception)
            {
                return BadRequest("El usuario no posee suscripciones activas");
            }

        }

        [AllowAnonymous]
        [HttpPost("webhooks")]
        public async Task<ActionResult> PostWebhook([FromBody]WebhookRequestData data)
        {
            try
            {
                await _interactorAnalizarWebhook.Analizar(data);
            } 
            catch (Exception ex ) { Console.WriteLine(ex); }            
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("email")]
        public async Task<ActionResult> PostMail()
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress("Closely", "4closely@gmail.com"));

            emailMessage.To.Add(new MailboxAddress("ignaciogarciagimenez@gmail.com"));

            emailMessage.Subject = "Test";

            emailMessage.Body = new TextPart("plain")
            {
                Text = "Test"
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync("4closely@gmail.com", "Diamondbad1234");
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
            return Ok();
        }


        [HttpPut("{id}")]
        public ActionResult AprobarSuscripcion(string id)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var usuarioId = claim.Value;
            try
            {
                var res = _interactorAprobarSuscripcion.Aprobar(new AprobarSuscripcionInput
                {
                    SuscripcionId = id,
                    UsuarioId = usuarioId
                });
                if (res) return Ok();
                Console.WriteLine(res);
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Algo anduvo mal");
            }
        }

        public class CancelarSuscripcionInput
        {
            public string Motivo { get; set; }
        }
    }
}
