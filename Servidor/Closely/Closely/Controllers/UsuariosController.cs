using LogicaNegocio.Historiales.Eventos.HistorialPropio;
using LogicaNegocio.Usuarios.CambiarFotoPerfil;
using LogicaNegocio.Usuarios.CodigoSeguridad.ActualizarCodigo;
using LogicaNegocio.Usuarios.CodigoSeguridad.ConsultarCodigo;
using LogicaNegocio.Usuarios.ConsultarEstado;
using LogicaNegocio.Usuarios.ModificarDatos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Closely.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly IConsultarEstadoUsuarioInteractor _interactorCEU;
        private readonly IObtenerHistorialEventosPropioInteractor _interactorObtenerHistorialPropio;
        private readonly IModificarDatosUsuarioInteractor _interactorModificarDatosPerfil;
        private readonly ICambiarFotoPerfilInteractor _interactorCambiarFotoDePerfil;
        private readonly IConsultarCodigoSeguridadInteractor _interactorConsultarCodigo;
        private readonly IActualizarCodigoSeguridadInteractor _interactorActualizarCodigo;

        public UsuariosController(
            IConsultarEstadoUsuarioInteractor interactorCEU,
            IObtenerHistorialEventosPropioInteractor interactorOHP,
            IModificarDatosUsuarioInteractor interactorModificarDatosPerfil,
            ICambiarFotoPerfilInteractor interactorCambiarFotoDePerfil,
            IConsultarCodigoSeguridadInteractor interactorConsultarCodigo,
            IActualizarCodigoSeguridadInteractor interactorActualizarCodigo)
        {
            _interactorCEU = interactorCEU;
            _interactorObtenerHistorialPropio = interactorOHP;
            _interactorModificarDatosPerfil = interactorModificarDatosPerfil;
            _interactorCambiarFotoDePerfil = interactorCambiarFotoDePerfil;
            _interactorConsultarCodigo = interactorConsultarCodigo;
            _interactorActualizarCodigo = interactorActualizarCodigo;
        }

        [HttpGet]
        public ActionResult GetEstado()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            var output = _interactorCEU.ConsultarEstado(userId);
            if (output != null)
                return Ok(output);
            return BadRequest();
        }

        [HttpGet("codigo-seguridad")]
        public ActionResult GetCodigoSeguridad()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            try
            {
                var cod = _interactorConsultarCodigo.Consultar(userId);
                if (cod) return Ok();
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpPost("codigo-seguridad")]
        public ActionResult ActualizarCodigoEvento(ActualizarCodigoInput input)
        {
            if (input == null) return BadRequest("asdasd");
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            try
            {
                _interactorActualizarCodigo.Actualizar(input, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(new { error_message = ex.Message});
            }
        }

        [HttpGet("historial")]
        public ActionResult GetAllEventosPropios()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            try
            {
                var eventos = _interactorObtenerHistorialPropio.GetHistorialEventos(userId);
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Algo salio mal");
            }
        }

        [HttpPost]
        public ActionResult ModificarDatos(ModificarDatosUsuarioInput input)
        {
            Console.WriteLine("Ey: " + input.Nombre + " " + input.Apellido);
            if (input == null) return BadRequest();
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            var res = _interactorModificarDatosPerfil.ModificarDatos(userId, input);
            if (res)
                return Ok();
            return BadRequest("Algo fallo");
        }

        [HttpPost("picture")]
        public async Task<ActionResult> SubirFotoPerfil([FromForm]Picture pic)
        {
            if (pic.File.Length <= 0) return BadRequest("No subio foto");
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            var path = await _interactorCambiarFotoDePerfil.SubirFotoPerfil(userId, pic.File);
            if (path != "")
                return Ok(new { picture = path });
            return BadRequest("Algo salio mal");
        }

        public class Picture
        {
            public IFormFile File { get; set; }
        }
    }
}
