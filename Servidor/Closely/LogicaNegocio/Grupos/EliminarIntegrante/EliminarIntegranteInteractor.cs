using AutoMapper;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.EliminarIntegrante
{
    public class EliminarIntegranteInteractor : IEliminarIntegranteInteractor
    {
        public readonly IUnitOfWork _repositorio;
        public readonly IMapper _mapper;
        public readonly INotificatorInteractor _notificator;

        public EliminarIntegranteInteractor(IUnitOfWork repositorio, IMapper mapper, INotificatorInteractor notificator)
        {
            _repositorio = repositorio;
            _mapper = mapper;
            _notificator = notificator;
        }

        public GrupoDto EliminarIntegrante(EliminarIntegranteInput input, string adminId)
        {
            var grupo = _repositorio.Grupos.GetWithIntegrantes(input.GrupoId);
            if (grupo.Administrador.Id != adminId) throw new InvalidOperationException("Solo el admin del grupo puede eliminar integrantes");

            var usuarioAEliminar = _repositorio.Usuarios.Get(input.UsuarioId);
            grupo.Integrantes.Remove(usuarioAEliminar);


            _repositorio.Grupos.Update(grupo);
            _repositorio.Complete();

            Message notif = new Message
            {
                notification = new Message.Notification
                {
                    title = "Has sido eliminado de un grupo",
                    text = "Grupo: " + grupo.Nombre,
                    click_action = "ELIMINAR_INTEGRANTE"
                },
                data = new
                {
                    Id = grupo.Id,
                    Nombre = grupo.Nombre,
                    FechaHora = DateTime.Now,
                    Foto = grupo.FotoUrl
                },
                android = new
                {
                    priority = "high"
                }
            };

            if (usuarioAEliminar.EstaTranquilo()) _notificator.EnviarNotificacion(new string[] { input.UsuarioId }, notif);

            return _mapper.Map<GrupoDto>(grupo);
        }
    }
}
