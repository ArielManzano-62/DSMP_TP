using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dominio.Seguimientos;
using LogicaNegocio.Historiales.Seguimientos.HistorialGrupo;
using LogicaNegocio.Historiales.Seguimientos.HistorialPropio;
using LogicaNegocio.Seguimientos;
using LogicaNegocio.Seguimientos.Consultar;
using LogicaNegocio.Seguimientos.ConsultarSeguimiento;
using LogicaNegocio.Seguimientos.FinalizarSeguimiento;
using LogicaNegocio.Seguimientos.NuevoSeguimiento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Closely.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SeguimientosController : ControllerBase
    {
        private readonly IConsultarSeguimientosActivosInteractor _seguimientosActivosInteractor;
        private readonly INuevoSeguimientoInteractor _nuevoSeguimientoInteractor;
        private readonly IConsultarSeguimientoInteractor _consultarSeguimientoInteractor;
        private readonly IFinalizarSeguimientoInteractor _finalizarSeguimientoInteractor;
        private readonly IObtenerHistorialSeguimientosPropioInteractor _historialPropioInteractor;
        private readonly IObtenerHistorialSeguimientosGrupoInteractor _historialGrupoInteractor;

        public SeguimientosController(
            IConsultarSeguimientosActivosInteractor seguimientosActivosInteractor,
            INuevoSeguimientoInteractor nuevoSeguimientoInteractor,
            IConsultarSeguimientoInteractor consultarSeguimientoInteractor,
            IFinalizarSeguimientoInteractor finalizarSeguimientoInteractor,
            IObtenerHistorialSeguimientosPropioInteractor historialPropioInteractor,
            IObtenerHistorialSeguimientosGrupoInteractor historialGrupoInteractor)
        {
            _seguimientosActivosInteractor = seguimientosActivosInteractor;
            _nuevoSeguimientoInteractor = nuevoSeguimientoInteractor;
            _consultarSeguimientoInteractor = consultarSeguimientoInteractor;
            _finalizarSeguimientoInteractor = finalizarSeguimientoInteractor;
            _historialPropioInteractor = historialPropioInteractor;
            _historialGrupoInteractor = historialGrupoInteractor;
        }

        [HttpGet]
        public ActionResult<IEnumerable<SeguimientoVirtualDto>> GetAll()
        {
            var userId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            var seguimientos = _seguimientosActivosInteractor.Consultar(userId);
            return Ok(seguimientos);
        }

        [HttpGet("{id}")]
        public ActionResult<SeguimientoVirtualDto> Get(Guid id)
        {
            var userId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                var seguimiento = _consultarSeguimientoInteractor.Consultar(id);
                return Ok(seguimiento);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest();
            }
            
        }

        [HttpGet("historial")]
        public ActionResult<IEnumerable<LogicaNegocio.Historiales.Seguimientos.SeguimientoVirtualDto>> GetHistorialPropio()
        {
            var userId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                return Ok(_historialPropioInteractor.Obtener(userId));
            } catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpGet("historial/{id}")]
        public ActionResult<IEnumerable<LogicaNegocio.Historiales.Seguimientos.SeguimientoVirtualDto>> GetHistorialGrupo(Guid id)
        {
            var userId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                return Ok(_historialGrupoInteractor.Obtener(userId, id));
            } catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest();
            }
        }

        [HttpPost]
        public ActionResult<SeguimientoVirtualDto> Crear(NuevoSeguimientoInput input)
        {
            var userId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            var nuevoSeguimiento = _nuevoSeguimientoInteractor.NuevoSeguimiento(userId, input);
            return Ok(nuevoSeguimiento);
        }

        [HttpPost("finalizar")]
        public ActionResult Finalizar(FinalizarSeguimientoInput input)
        {
            var userId = User.FindFirst(x => x.Type.Contains("nameidentifier")).Value;
            try
            {
                var response = _finalizarSeguimientoInteractor.Finalizar(userId, input);
                if (response) return Ok();
                return BadRequest();                    
            }
            catch (ArgumentException ex)
            {
                if (ex.ParamName == "codigo")
                    return BadRequest(new { error_message = "Código incorrecto" });
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { error_message = ex.Message});
            }

        }
    }
}
