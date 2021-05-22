using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using LogicaNegocio.WebSockets;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Grupos.RegistrarMensaje
{
    public class RegistrarMensajeInteractor : IRegistrarMensajeInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly INotificatorInteractor _notificator;
        private readonly IHubContext<GrupoHub> _hubContext;

        public RegistrarMensajeInteractor(IUnitOfWork repo, INotificatorInteractor notificator, IHubContext<GrupoHub> hubContext)
        {
            _repositorio = repo;
            _notificator = notificator;
            _hubContext = hubContext;
        }

        public void NuevoMensaje(string message, string integranteId, Guid grupoId)
        {
            if (grupoId == null) throw new ArgumentNullException("grupoId", "El Id del grupo fue null");
            if (integranteId == null) throw new ArgumentNullException("integranteId", "El Id del integrante fue null");
            Grupo grupo = _repositorio.Grupos.GetWithIntegrantes(grupoId);
            if (grupo == null) throw new ArgumentException($"Grupo con Id {grupoId} no existe");
            Usuario integrante = grupo.Integrantes.FirstOrDefault(i => i.Id == integranteId);
            if (integrante == null) throw new ArgumentException($"Integrante con Id {integranteId} no existe");

            RegistroMensaje nuevoRegistro = grupo.NuevoMensaje(message, integrante);
            

            
            List<string> webSocketUserIds = new List<string>();
            List<string> pushNotificationUserIds = new List<string>();
            foreach (Usuario i in grupo.Integrantes)
            {
                if (!i.EstaTranquilo()) continue;
                if (GrupoHub.connectedUserIds.Keys.Contains(i.Id))
                {
                    Console.WriteLine("Agregando a WebSockets: " + i.Id);
                    webSocketUserIds.Add(i.Id);
                } 
                else
                {
                    Console.WriteLine("Agregando a FCM: " + i.Id);
                    pushNotificationUserIds.Add(i.Id);
                }
            }

            webSocketUserIds.Remove(integranteId);
            pushNotificationUserIds.Remove(integranteId);

            _hubContext.Clients.Users(webSocketUserIds.AsReadOnly()).SendAsync("NuevoMensaje", nuevoRegistro);
            _hubContext.Clients.User(integranteId).SendAsync("MensajeExitoso", nuevoRegistro);


            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            Message notif = new Message
            {
                notification = new Message.Notification
                {
                    title = $"{nuevoRegistro.Mensaje.NombreEmisor} @ {grupo.Nombre}",
                    text = nuevoRegistro.Mensaje.Contenido,
                    click_action = "NUEVO_MENSAJE"
                },
                data = new
                {
                    Id = grupo.Id,
                    IntegranteId = integrante.Id,
                    NombreGrupo = grupo.Nombre,
                    NombreIntegrante = $"{integrante.Nombre} {integrante.Apellido}",
                    Mensaje = JsonConvert.SerializeObject(nuevoRegistro, serializerSettings),
                    FechaHoraMensaje = nuevoRegistro.FechaHoraMensaje
                },
                android = new
                {
                    priority = "high"
                }
            };

            _notificator.EnviarNotificacion(pushNotificationUserIds.ToArray(), notif);

            _repositorio.Grupos.Update(grupo);
            _repositorio.Complete();

        }
    }
}
