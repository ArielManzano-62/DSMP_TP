using LogicaNegocio.Estadisticas.MapaCalor;
using LogicaNegocio.Eventos.ConsultarEvento;
using LogicaNegocio.Eventos.ConsultarEventosActivos;
using LogicaNegocio.Eventos.FinalizarEvento;
using LogicaNegocio.Eventos.NuevoEvento;
using LogicaNegocio.Eventos.ResolverEvento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Closely.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EventosController : ControllerBase
    {
        private readonly INuevoEventoInteractor _interactorNuevoEvento;
        private readonly IConsultarEventoInteractor _interactorConsultarEvento;
        private readonly IFinalizarEventoInteractor _interactorFinalizarEvento;
        private readonly IResolverEventoInteractor _interactorResolverEvento;
        private readonly IConsultarEventosActivosInteractor _interactorConsultarEventosActivos;
        private readonly IObtenerPuntosDeEventosInteractor _interactorObtenerPuntos;

        public EventosController(INuevoEventoInteractor interactorNE,
            IConsultarEventoInteractor interactorCE,
            IFinalizarEventoInteractor interactorFE,
            IResolverEventoInteractor interactorRE,
            IConsultarEventosActivosInteractor interactorCEA,
            IObtenerPuntosDeEventosInteractor interactorObtenerPuntos)
        {
            _interactorNuevoEvento = interactorNE;
            _interactorConsultarEvento = interactorCE;
            _interactorFinalizarEvento = interactorFE;
            _interactorResolverEvento = interactorRE;
            _interactorConsultarEventosActivos = interactorCEA;
            _interactorObtenerPuntos = interactorObtenerPuntos;

        }
        [HttpPost("estadisticas")]
        public ActionResult<IEnumerable<PuntosDto>> GetAll([FromBody]RangoFechasRequest req)
        {
            if (req == null) return BadRequest();
            try
            {
                var res = _interactorObtenerPuntos.ObtenerPuntos(req);
                return Ok(res);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpGet]
        public ActionResult<ICollection<LogicaNegocio.Eventos.ConsultarEvento.EventoDto>> GetAllActive()
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            try
            {
                ICollection<LogicaNegocio.Eventos.ConsultarEvento.EventoDto> eventosActivos = _interactorConsultarEventosActivos.ConsultarEventosActivos(userId);
                return Ok(eventosActivos);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }

        }



        [HttpGet("{id}")]
        public ActionResult<LogicaNegocio.Eventos.ConsultarEvento.EventoDto> Get(Guid id)
        {
            LogicaNegocio.Eventos.ConsultarEvento.EventoDto output = _interactorConsultarEvento.ConsultarEvento(id);
            if (output != null)
                return Ok(output);
            else
                return BadRequest("Something Went Wrong");
        }


        [HttpPost]
        public ActionResult Post([FromBody] EventoInput datosEvento)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            NuevoEventoInput input = new NuevoEventoInput
            {
                TipoEvento = datosEvento.TipoEvento,
                UsuarioId = userId
            };
            NuevoEventoOutput output = _interactorNuevoEvento.NuevoEvento(input);
            if (output != null)
                return Ok(output);
            return BadRequest(new { result = "Something went wrong :(" });
        }

        [HttpPost("finalizar")]
        public ActionResult FinalizarEvento(FinalizarEventoInput input)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            var output = _interactorFinalizarEvento.Finalizar(userId, input.CodigoFinalizacion);
            if (output != null)
                return Ok(output);
            return BadRequest("Código incorrecto");
        }

        [HttpPost("resolver")]
        public ActionResult ResolverEvento(ResolverEventoInput input)
        {
            var claim = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var userId = claim.Value;
            var output = _interactorResolverEvento.ResolverEvento(userId, input);
            if (output != null)
                return Ok(output);
            return BadRequest("Algo salió mal");
        }

        //TODO: Mover a otro lado
        public class EventoInput
        {
            public string TipoEvento { get; set; }
        }

        public class FinalizarEventoInput
        {
            public string CodigoFinalizacion { get; set; }
        }
    }
}
