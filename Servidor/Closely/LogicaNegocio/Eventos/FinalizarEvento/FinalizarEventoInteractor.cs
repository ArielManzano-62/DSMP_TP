using Dominio.Eventos;
using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Eventos.FinalizarEvento
{
    public class FinalizarEventoInteractor : IFinalizarEventoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly INotificatorInteractor _notificator;

        public FinalizarEventoInteractor(IUnitOfWork repo, INotificatorInteractor notificator)
        {
            _repositorio = repo;
            _notificator = notificator;
        }

        public FinalizarEventoOutput Finalizar(string usuarioId, string codigo)
        {
            Usuario usuario = _repositorio.Usuarios.GetUsuarioConEventoYGrupos(usuarioId);
            try
            {
                usuario.FinalizarEvento(codigo);
                Evento ev = usuario.EventoActual;
                //_repositorio.Eventos.Update(ev);

                ICollection<string> userIds = new List<string>();
                foreach (Grupo g in ev.Notificados)
                {
                    foreach (Usuario u in g.Integrantes)
                    {
                        if (u.EstaTranquilo() && !u.Equals(usuario) && !userIds.Contains(u.Id))
                            userIds.Add(u.Id);
                    }
                }

                userIds = userIds.Distinct().ToList();


                Message notif = new Message
                {
                    notification = new Message.Notification
                    {
                        title = "¡" + usuario.Nombre + " " + usuario.Apellido + " ya se encuentra bien!",
                        text = "Hecho: " + ev.GetType().ToString().Split('.').Last() + Environment.NewLine + "Hora: " + ev.FechaHoraFin.ToShortTimeString(),
                        click_action = "FIN_EVENTO"
                    },
                    data = new
                    {
                        Id = ev.Id,
                        Nombre = usuario.Nombre + " " + usuario.Apellido,
                        FechaHoraInicio = ev.FechaHoraInicio,
                        FechaHoraFin = ev.FechaHoraFin,
                        TipoEvento = ev.ToString(),
                        Foto = usuario.FotoUrl
                    },
                    android = new
                    {
                        priority = "high"
                    }
                };

                _notificator.EnviarNotificacion(userIds.ToArray(), notif);


                _repositorio.Usuarios.Update(usuario);
                _repositorio.Complete();

                var output = new FinalizarEventoOutput
                {
                    EventoId = ev.Id,
                    TipoEvento = ev.GetType().ToString().Split('.').Last(),
                    NombreUsuario = usuario.Nombre,
                    ApellidoUsuario = usuario.Apellido,
                    FechaHoraInicio = ev.FechaHoraInicio,
                    FechaHoraFin = ev.FechaHoraFin,
                    Estado = ev.Estado.ToString()
                };
                return output;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

        }
    }
}
