using LogicaNegocio.Notificaciones.DesuscribirFcmKey;
using LogicaNegocio.Notificaciones.SuscribirFcmKey;
using LogicaNegocio.Usuarios.Crear;
using LogicaNegocio.Usuarios.Registrar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Closely.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly ICrearUsuarioInteractor _interactorCU;
        private readonly IRegistrarUsuarioInteractor _interactorRU;
        private readonly ISuscribirFcmKeyInteractor _interactorSuscribirFcmKey;
        private readonly IDesuscribirFcmKeyInteractor _interactorDesuscribirFcmKey;

        public RegisterController(ICrearUsuarioInteractor interactorCU,
            IRegistrarUsuarioInteractor interactorRU,
            ISuscribirFcmKeyInteractor interactorSuscribirFcmKey,
            IDesuscribirFcmKeyInteractor interactorDesuscribirFcmKey)
        {
            _interactorCU = interactorCU;
            _interactorRU = interactorRU;
            _interactorSuscribirFcmKey = interactorSuscribirFcmKey;
            _interactorDesuscribirFcmKey = interactorDesuscribirFcmKey;
        }

        [HttpPost]
        [Route("crear")]
        public ActionResult CrearUsuario(CrearUsuarioInput input)
        {
            _interactorCU.Crear(input);
            return Ok();
        }

        [HttpPost]
        public ActionResult RegistrarUsuario(object input)
        {
            dynamic data = input;
            var interactorInput = new RegistrarUsuarioInput
            {
                UserId = data.user.user_id,
                Nombre = data.user.given_name,
                Apellido = data.user.family_name,
                Email = data.user.email,
                FotoUrl = data.user.picture
            };
            _interactorRU.RegistrarUsuario(interactorInput);
            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> VerificarUsuarioExistente(string email)
        {
            var resp = await _interactorCU.VerificarEmailExistente(email);
            if (resp)
            {
                return Ok();
            }
            return BadRequest();
        }

        [Authorize]
        [HttpPost("notifications")]
        public IActionResult Post([FromBody] FcmInput input)
        {
            var c = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            var interactorInput = new SuscribirFcmKeyInput
            {
                FcmKey = input.ApiKey,
                UsuarioId = c.Value
            };
            var resp = _interactorSuscribirFcmKey.RegisterKey(interactorInput);
            return Ok(resp);
        }

        [Authorize]
        [HttpDelete("notifications")]
        public IActionResult Delete([FromBody] FcmInput input)
        {
            var c = User.FindFirst(x => x.Type.Contains("nameidentifier"));
            _interactorDesuscribirFcmKey.Unregister(c.Value, input.ApiKey);
            return Ok();
        }


        public class FcmInput
        {
            public string ApiKey { get; set; }
        }


    }
}
