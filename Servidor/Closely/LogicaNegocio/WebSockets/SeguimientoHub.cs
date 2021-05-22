using LogicaNegocio.Seguimientos.ActualizarUbicacion;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using static LogicaNegocio.WebSockets.EventoHub;

namespace LogicaNegocio.WebSockets
{
    public class SeguimientoHub : Hub
    {
        private readonly IActualizarUbicacionSeguimientoInteractor _interactorActualizarUbicacion;

        public SeguimientoHub(
            IActualizarUbicacionSeguimientoInteractor interactorActualizarUbicacion)
        {
            _interactorActualizarUbicacion = interactorActualizarUbicacion;
        }

        public async Task Subscribe(Guid seguimientoId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, seguimientoId.ToString());
        }

        public async Task Unsubscribe(Guid seguimientoId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, seguimientoId.ToString());
        }

        public async Task<ActualizarUbicacionOutput> UpdateLocation(Guid seguimientoId, UbicacionDto ubicacion)
        {
            try
            {
                var output = await _interactorActualizarUbicacion.Actualizar(seguimientoId, ubicacion.Latitude, ubicacion.Longitude);
                await Clients.OthersInGroup(seguimientoId.ToString()).SendAsync("UpdateLocation", output.Ubicacion);
                return output;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }
    }
}
