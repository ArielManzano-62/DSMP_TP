using Dominio.Eventos;
using LogicaNegocio.Eventos.ActualizarUbicacionEvento;
using LogicaNegocio.Eventos.NuevoMensaje;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.WebSockets
{
    public class EventoHub : Hub
    {
        private readonly IActualizarUbicacionEventoInteractor _interactor;
        private readonly INuevoMensajeEventoInteractor _interactorNuevoMensaje;

        public EventoHub(IActualizarUbicacionEventoInteractor interactor,
            INuevoMensajeEventoInteractor interactorNuevoMensaje)
        {
            _interactor = interactor;
            _interactorNuevoMensaje = interactorNuevoMensaje;
        }

        public async Task Subscribe(Guid eventoId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, eventoId.ToString());
        }

        public async Task Unsubscribe(Guid eventoId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, eventoId.ToString());
        }

        public async Task UpdateLocation(Guid eventoId, UbicacionDto ubicacion)
        {
            try
            {
                _interactor.ActualizarUbicacion(eventoId, ubicacion.Latitude, ubicacion.Longitude);
                await Clients.OthersInGroup(eventoId.ToString()).SendAsync("UpdateLocation", ubicacion);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }

        public async Task<RegistroMensaje> NuevoMensaje(NuevoMensajeInput input)
        {
            try
            {
                var nuevoMensaje = _interactorNuevoMensaje.Registrar(input.Mensaje, input.UserId, input.EventoId);
                await Clients.OthersInGroup(input.EventoId.ToString()).SendAsync("NuevoMensaje", nuevoMensaje);
                return nuevoMensaje;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public class UbicacionDto
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }
        }

        public class NuevoMensajeInput
        {
            public string Mensaje { get; set; }
            public string UserId { get; set; }
            public Guid EventoId { get; set; }
        }
    }
}
