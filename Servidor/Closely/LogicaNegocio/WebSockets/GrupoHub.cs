using LogicaNegocio.Grupos.RegistrarMensaje;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.WebSockets
{
    [Authorize]
    public class GrupoHub : Hub
    {
        private readonly IRegistrarMensajeInteractor _interactorRM;
        public static IDictionary<string, string> connectedUserIds = new Dictionary<string, string>();

        public GrupoHub(IRegistrarMensajeInteractor interactorRM)
        {
            _interactorRM = interactorRM;
        }

        public override Task OnConnectedAsync()
        {
            lock (connectedUserIds)
            {
                connectedUserIds[Context.UserIdentifier] = Context.ConnectionId;
            }
            return base.OnConnectedAsync();

        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            lock (connectedUserIds)
            {
                connectedUserIds.Remove(Context.UserIdentifier);
            }
            return base.OnDisconnectedAsync(exception);

        }

        public async Task NewMessage(Guid grupoId, NuevoMensajeInput input)
        {
            try
            {                
                _interactorRM.NuevoMensaje(input.message, input.integranteId, grupoId);
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine(ex);
                await Clients.Caller.SendAsync("Eliminado");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                await Clients.Caller.SendAsync("MensajeFallido");
            }

        }

        public class NuevoMensajeInput
        {
            public string integranteId { get; set; }
            public string message { get; set; }
        }
    }
}
