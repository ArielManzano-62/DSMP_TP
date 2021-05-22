using LogicaNegocio.Grupos.AbandonarGrupo;
using LogicaNegocio.Grupos.AgregarIntegrantes;
using LogicaNegocio.Grupos.CambiarFoto;
using LogicaNegocio.Grupos.ConfigurarEventosGrupo;
using LogicaNegocio.Grupos.ConfigurarEventosGrupo.ConsultarConfiguracion;
using LogicaNegocio.Grupos.CrearGrupo;
using LogicaNegocio.Grupos.EliminarIntegrante;
using LogicaNegocio.Grupos.ObtenerGrupo;
using LogicaNegocio.Grupos.ObtenerGrupos;
using LogicaNegocio.Historiales.Eventos.HistorialGrupo;
using LogicaNegocio.Usuarios.ConsultarPorMail;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Closely.Controllers
{

    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class GruposController : ControllerBase
    {
        private readonly IObtenerHistorialEventosGrupoInteractor _interactorObtenerHistorialGrupo;
        private readonly IConfigurarEventosGrupoInteractor _interactorConfigurarEventos;
        private readonly IConsultarConfiguracionGrupoInteractor _interactorConsultarConfiguracion;
        private readonly ICrearGrupoInteractor _interactorCG;
        private readonly IConsultarUsuarioPorMailInteractor _interactorCIXM;
        private readonly IObtenerGruposInteractor _interactorOG;
        private readonly IObtenerGrupoInteractor _interactorObtenerGrupo;
        private readonly IAbandonarGrupoInteractor _interactorAbandonarGrupo;
        private readonly IAgregarIntegrantesInteractor _interactorAgregarIntegrantes;
        private readonly ICambiarFotoGrupoInteractor _interactorCambiarFoto;
        private readonly IEliminarIntegranteInteractor _interactorEliminarIntegrante;

        public GruposController(
            IObtenerHistorialEventosGrupoInteractor interactorObtenerHistorialGrupo,
            IConfigurarEventosGrupoInteractor interactorConfigurarEventos,
            IConsultarConfiguracionGrupoInteractor interactorConsultarConfiguracion,
            ICrearGrupoInteractor interactorCG,
            IConsultarUsuarioPorMailInteractor interactorCIXM,
            IObtenerGruposInteractor interactorOG,
            IObtenerGrupoInteractor interactorObtenerGrupo,
            IAbandonarGrupoInteractor interactorAbandonarGrupo,
            IAgregarIntegrantesInteractor interactorAgregarIntegrantes,
            ICambiarFotoGrupoInteractor interactorCambiarFoto,
            IEliminarIntegranteInteractor interactorEliminarIntegrante)
        {
            _interactorObtenerHistorialGrupo = interactorObtenerHistorialGrupo;
            _interactorConfigurarEventos = interactorConfigurarEventos;
            _interactorConsultarConfiguracion = interactorConsultarConfiguracion;
            _interactorCG = interactorCG;
            _interactorCIXM = interactorCIXM;
            _interactorOG = interactorOG;
            _interactorObtenerGrupo = interactorObtenerGrupo;
            _interactorAbandonarGrupo = interactorAbandonarGrupo;
            _interactorAgregarIntegrantes = interactorAgregarIntegrantes;
            _interactorCambiarFoto = interactorCambiarFoto;
            _interactorEliminarIntegrante = interactorEliminarIntegrante;
        }

        [HttpGet]
        public ActionResult GetAllGroups()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var integranteId = claim.Value;
            try
            {
                var output = _interactorOG.Obtener(integranteId);
                return Ok(output);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Excepcion obteniendo grupos");
                Console.WriteLine(ex);
            }
            return BadRequest();



        }

        [HttpGet("{id}")]
        public ActionResult GetGrupo(Guid id)
        {
            try
            {
                return Ok(_interactorObtenerGrupo.Obtener(id));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest();
            }
        }

        [HttpGet("integrantes")]
        public ActionResult GetByEmail(string email)
        {
            if (email == null) return BadRequest(new { error = "Email es null" });
            try
            {
                UsuarioDto i = _interactorCIXM.Consultar(email);
                return Ok(i);
            }
            catch (ArgumentException e)
            {
                Console.WriteLine(e.Message);
                return BadRequest();
            }
        }

        [HttpPost("integrantes")]
        public ActionResult AbandonarGrupo(AbandonarGrupoInput input)
        {
            Console.WriteLine("entre");
            if (input == null || input.GrupoId == null || input.UsuarioId == null || input.UsuarioId == "")
            {
                Console.WriteLine("Algun dato fue null");
                return BadRequest("Alguna dato fue null");
            }

            var result = _interactorAbandonarGrupo.Abandonar(input);
            if (result)
                return Ok();
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult> CrearGrupo([FromForm]CrearGrupoInput input)
        {
            if (input.GrupoNombre == "") return BadRequest("No proporciono nombre de grupo");
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var adminId = claim.Value;
            var grupo = await _interactorCG.CrearGrupo(input, adminId);
            return Ok(grupo);
        }

        [HttpPost("agregar-integrantes")]
        public ActionResult AgregarIntegrantes(AgregarIntegrantesInput input)
        {
            var adminId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                var output = _interactorAgregarIntegrantes.AgregarIntegrantes(input, adminId);
                return Ok(output);
            } catch (Exception)
            {
                return BadRequest();
            }
            
        }

        [HttpPost("eliminar-integrante")]
        public ActionResult EliminarIntegrante(EliminarIntegranteInput input)
        {
            var adminId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                var output = _interactorEliminarIntegrante.EliminarIntegrante(input, adminId);
                return Ok(output);
            } catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost("cambiar-foto")]
        public async Task<ActionResult> CambiarFoto([FromForm]CambiarFotoGrupoInput input)
        {
            var adminId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                var output = await _interactorCambiarFoto.CambiarFoto(input, adminId);
                return Ok(output);
            } catch (Exception)
            {
                return BadRequest();
            }
        }


        [HttpGet("historial/{grupoId}")]
        public ActionResult GetHistorialGrupo(Guid grupoId)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            try
            {
                var eventos = _interactorObtenerHistorialGrupo.GetHisotrial(userId, grupoId);
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpPost("configurar")]
        public ActionResult ConfigurarGrupo(ConfigurarEventosInput input)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            if (input == null || input.GrupoId == null || input.GrupoId == Guid.Empty)
                return BadRequest("Mal los parametros");
            try
            {
                _interactorConfigurarEventos.ConfigurarEventos(userId, input);
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Algo salio mal");
            }
        }

        [HttpGet("configurar/{grupoId}")]
        public ActionResult ObtenerConfiguraciones(Guid grupoId)
        {
            if (grupoId == null || grupoId == Guid.Empty) return BadRequest("Mal datos");
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            try
            {
                var output = _interactorConsultarConfiguracion.ObtenerConfiguracion(userId, grupoId);
                return Ok(output);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Algo salio mal");
            }
        }
    }
}
