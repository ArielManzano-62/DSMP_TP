using Dominio.Eventos;
using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Eventos.NuevoEvento
{
    public class NuevoEventoInteractor : INuevoEventoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly INotificatorInteractor _notificator;

        public NuevoEventoInteractor(IUnitOfWork repositorio, INotificatorInteractor notificator)
        {
            _repositorio = repositorio;
            _notificator = notificator;
        }

        public NuevoEventoOutput NuevoEvento(NuevoEventoInput datosEvento)
        {

            Usuario user = _repositorio.Usuarios.GetUsuarioConEstadoYGrupos(datosEvento.UsuarioId);
            try
            {

                Evento nuevoEvento = user.EnviarEvento(datosEvento.TipoEvento);
                _repositorio.Eventos.Add(nuevoEvento);
                _repositorio.Usuarios.Update(user);

                _repositorio.Complete();

                var output = new NuevoEventoOutput
                {
                    EventoId = nuevoEvento.Id,
                    NombreUsuario = user.Nombre,
                    ApellidoUsuario = user.Apellido,
                    TipoEvento = nuevoEvento.ToString(),
                    FechaHoraInicio = nuevoEvento.FechaHoraInicio,
                    Estado = nuevoEvento.Estado.ToString(),
                    Mensajes = nuevoEvento.Mensajes.OrderByDescending(m => m.NroMensaje).ToList(),
                    Ubicaciones = nuevoEvento.Ubicaciones,
                };


                ICollection<string> userIds = new List<string>();
                foreach (Grupo g in nuevoEvento.Notificados)
                {
                    foreach (Usuario u in g.Integrantes)
                    {
                        if (u.EstaTranquilo() && !u.Equals(user) && !userIds.Contains(u.Id))
                            userIds.Add(u.Id);
                    }

                }

                userIds = userIds.Distinct().ToList();

                Message notif = new Message
                {
                    notification = new Message.Notification
                    {
                        title = "¡" + user.Nombre + " " + user.Apellido + " necesita ayuda!",
                        text = "Hecho: " + nuevoEvento.GetType().ToString().Split('.').Last() + Environment.NewLine + "Hora: " + nuevoEvento.FechaHoraInicio.ToShortTimeString(),
                        click_action = "NUEVO_EVENTO"
                    },
                    data = new
                    {
                        Id = nuevoEvento.Id,
                        Nombre = user.Nombre + " " + user.Apellido,
                        FechaHora = nuevoEvento.FechaHoraInicio,
                        TipoEvento = nuevoEvento.ToString(),
                        Foto = user.FotoUrl
                    },
                    android = new
                    {
                        priority = "high"
                    }
                };

                _notificator.EnviarNotificacion(userIds.ToArray(), notif);

                return output;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " " + ex.StackTrace);
                return null;
            }
        }
    }
}
