using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Seguimientos.FinalizarSeguimiento
{
    public class FinalizarSeguimientoInteractor : IFinalizarSeguimientoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly INotificatorInteractor _notificator;

        public FinalizarSeguimientoInteractor(
            IUnitOfWork repositorio,
            INotificatorInteractor notificator)
        {
            _repositorio = repositorio;
            _notificator = notificator;
        }

        public bool Finalizar(string userId, FinalizarSeguimientoInput input)
        {
            var seguimiento = _repositorio.Seguimientos.GetWithUserAndGroups(input.SeguimientoId);
            if (seguimiento == null) throw new ArgumentException("No existe seguimiento con dicho id");
            if (!seguimiento.EstaEnTranscurso()) throw new InvalidOperationException("No se puede finalizar un seguimiento ya finalizado");
            if (seguimiento.Usuario.Id != userId) throw new UnauthorizedAccessException($"El seguimiento no es del usuario con id {userId}");

            var usuario = _repositorio.Usuarios.GetWithEventoYSeguimiento(userId);
            try
            {
                usuario.FinalizarSeguimiento(input.Codigo);
                ICollection<string> userIds = new List<string>();

                foreach (Grupo g in seguimiento.Grupos)
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
                        title = "¡" + usuario.Nombre + " " + usuario.Apellido + " ha finalizado el seguimiento!",
                        text = "Destino: " + seguimiento.Ruta.DireccionDestino + Environment.NewLine + "Hora: " + seguimiento.FechaHoraFin.ToShortTimeString(),
                        click_action = "FIN_SEGUIMIENTO"
                    },
                    data = new
                    {
                        Id = seguimiento.Id,
                        Modo = "manual",
                        Nombre = usuario.Nombre + " " + usuario.Apellido,
                        FechaHoraInicio = seguimiento.FechaHoraInicio,
                        FechaHoraFin = seguimiento.FechaHoraFin,
                        Destino = seguimiento.Ruta.DireccionDestino,
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

                return true;
            } 
            catch (ArgumentException ex)
            {
                if (ex.ParamName == "codigo") throw ex;
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
