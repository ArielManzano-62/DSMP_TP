using AutoMapper;
using Dominio.Grupos;
using Dominio.Seguimientos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using LogicaNegocio.Seguimientos.FinalizarSeguimiento;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Seguimientos.NuevoSeguimiento
{
    public class NuevoSeguimientoInteractor : INuevoSeguimientoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;
        private readonly INotificatorInteractor _notificator;

        public NuevoSeguimientoInteractor(
            IUnitOfWork repositorio,
            IMapper mapper,
            INotificatorInteractor notificator)
        {
            _repositorio = repositorio;
            _mapper = mapper;
            _notificator = notificator;
        }

        public SeguimientoVirtualDto NuevoSeguimiento(string userId, NuevoSeguimientoInput input)
        {
            var user = _repositorio.Usuarios.Get(userId);
            var grupos = _repositorio.Grupos.GetAllWithIntegrantes().Where(g => input.GrupoIds.Contains(g.Id));
            var seguimiento = new SeguimientoVirtual(input.Origen, input.Destino, input.Waypoints, input.Modo, input.EncodedPolyline, input.DireccionDestino, user);
            ICollection<string> userIds = new List<string>();

            foreach (Grupo g in grupos)
            {
                seguimiento.Grupos.Add(g);
                foreach (Usuario u in g.Integrantes)
                {
                    if (u.EstaTranquilo() && !u.Equals(user) && !userIds.Contains(u.Id))
                        userIds.Add(u.Id);
                }
            }

            user.IniciarSeguimiento(seguimiento);

            userIds = userIds.Distinct().ToList();            

            Message notif = new Message
            {
                notification = new Message.Notification
                {
                    title = user.Nombre + " " + user.Apellido + " ha iniciado un seguimiento virtual",
                    text = "Destino: " + seguimiento.Ruta.DireccionDestino + Environment.NewLine + "Hora: " + seguimiento.FechaHoraInicio.ToShortTimeString(),
                    click_action = "NUEVO_SEGUIMIENTO"
                },
                data = new
                {
                    Id = seguimiento.Id,
                    Nombre = user.Nombre + " " + user.Apellido,
                    FechaHoraInicio = seguimiento.FechaHoraInicio,
                    Destino = seguimiento.Ruta.DireccionDestino,
                    Foto = user.FotoUrl
                },
                android = new
                {
                    priority = "high"
                }
            };

            _notificator.EnviarNotificacion(userIds.ToArray(), notif);

            _repositorio.Usuarios.Update(user);
            _repositorio.Complete();

            return _mapper.Map<SeguimientoVirtualDto>(seguimiento);
        }
    }
}
