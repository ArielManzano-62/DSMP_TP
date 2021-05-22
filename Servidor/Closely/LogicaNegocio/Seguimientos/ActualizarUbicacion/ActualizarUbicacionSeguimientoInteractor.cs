using Dominio.Grupos;
using Dominio.Seguimientos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using LogicaNegocio.Seguimientos.FinalizarSeguimiento;
using Microsoft.AspNetCore.NodeServices;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Seguimientos.ActualizarUbicacion
{
    public class ActualizarUbicacionSeguimientoInteractor : IActualizarUbicacionSeguimientoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly INodeServices _nodeServices;
        private readonly INotificatorInteractor _notificatorInteractor;

        public ActualizarUbicacionSeguimientoInteractor(
            IUnitOfWork repositorio,
            INodeServices nodeServices,
            INotificatorInteractor notificatorInteractor)
        {
            _repositorio = repositorio;
            _nodeServices = nodeServices;
            _notificatorInteractor = notificatorInteractor;
        }

        public async Task<ActualizarUbicacionOutput> Actualizar(Guid seguimientoId, double latitude, double longitude)
        {
            var seguimiento = _repositorio.Seguimientos.GetWithUserAndGroups(seguimientoId);
            if (seguimiento == null) throw new NullReferenceException($"No existe seguimiento con id {seguimientoId}");

            var ubicacion = seguimiento.ActualizarUbicacion(latitude, longitude);

            _repositorio.Seguimientos.Update(seguimiento);
            _repositorio.Complete();

            var posicion = new
            {
                lat = ubicacion.Posicion.Latitude,
                lng = ubicacion.Posicion.Longitude
            };

            var distanciaADestino = await _nodeServices.InvokeAsync<double>("scripts/computeDistanceBetween.js",
                posicion,
                new
                {
                    lat = seguimiento.Ruta.Destino.Latitude,
                    lng = seguimiento.Ruta.Destino.Longitude
                });

            if (distanciaADestino <= 10)
            {
                //Llego al destino
                var usuario = _repositorio.Usuarios.GetWithEventoYSeguimiento(seguimiento.Usuario.Id);
                usuario.FinalizarSeguimientoAutomaticamente();
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
                        title = "¡" + usuario.Nombre + " " + usuario.Apellido + " ha llegado a su destino!",
                        text = "Destino: " + seguimiento.Ruta.DireccionDestino + Environment.NewLine + "Hora: " + seguimiento.FechaHoraFin.ToShortTimeString(),
                        click_action = "FIN_SEGUIMIENTO"
                    },
                    data = new
                    {
                        Id = seguimiento.Id,
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

                Task.Run(() => _notificatorInteractor.EnviarNotificacion(userIds.ToArray(), notif));

                _repositorio.Usuarios.Update(usuario);
                _repositorio.Complete();
                return new ActualizarUbicacionOutput("FINALIZAR", ubicacion);
            }

            var tolerancia = seguimiento.Ruta.Modo == "WALKING" ? 100 : 300;

            var sigueEnRuta = await _nodeServices.InvokeAsync<bool>("scripts/isLocationOnEdge.js",
                posicion,
                seguimiento.Ruta.EncodedPolyline,
                tolerancia);

            if (!sigueEnRuta)
            {
                try
                {
                    seguimiento.Desviar();
                    var usuario = _repositorio.Usuarios.GetWithEventoYSeguimiento(seguimiento.Usuario.Id);
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
                            title = "¡" + usuario.Nombre + " " + usuario.Apellido + " se ha desviado del camino!",
                            text = "Hora: " + ubicacion.FechaHora.ToShortTimeString(),
                            click_action = "DESVIO_SEGUIMIENTO"
                        },
                        data = new
                        {
                            Id = seguimiento.Id,
                            Nombre = usuario.Nombre + " " + usuario.Apellido,
                            FechaHora = ubicacion.FechaHora,
                            Foto = usuario.FotoUrl
                        },
                        android = new
                        {
                            priority = "high"
                        }
                    };

                    Task.Run(() => _notificatorInteractor.EnviarNotificacion(userIds.ToArray(), notif));

                    _repositorio.Seguimientos.Update(seguimiento);
                    _repositorio.Complete();
                    return new ActualizarUbicacionOutput("DESVIAR", ubicacion);


                } catch (InvalidOperationException ex) {
                    
                } catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
                
            } else
            {
                try
                {
                    seguimiento.Encursar();
                    var usuario = _repositorio.Usuarios.GetWithEventoYSeguimiento(seguimiento.Usuario.Id);
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
                            title = "¡" + usuario.Nombre + " " + usuario.Apellido + " ha vuelto a su recorrido!",
                            text = "Hora: " + ubicacion.FechaHora.ToShortTimeString(),
                            click_action = "ENCURSAR_SEGUIMIENTO"
                        },
                        data = new
                        {
                            Id = seguimiento.Id,
                            Nombre = usuario.Nombre + " " + usuario.Apellido,
                            FechaHora = ubicacion.FechaHora,
                            Foto = usuario.FotoUrl
                        },
                        android = new
                        {
                            priority = "high"
                        }
                    };

                    Task.Run(() => _notificatorInteractor.EnviarNotificacion(userIds.ToArray(), notif));

                    

                    _repositorio.Seguimientos.Update(seguimiento);
                    _repositorio.Complete();
                    return new ActualizarUbicacionOutput("ENCURSAR", ubicacion);

                } catch (InvalidOperationException) { }  
                catch (Exception ex) { Console.WriteLine(ex); }
            }                     

            return new ActualizarUbicacionOutput(ubicacion);
        }
    }
}
