using AutoMapper;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Grupos.AgregarIntegrantes
{
    public class AgregarIntegrantesInteractor : IAgregarIntegrantesInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;
        private readonly INotificatorInteractor _notificator;

        public AgregarIntegrantesInteractor(IUnitOfWork repositorio, IMapper mapper, INotificatorInteractor notificator)
        {
            _repositorio = repositorio;
            _mapper = mapper;
            _notificator = notificator;
        }

        public GrupoDto AgregarIntegrantes(AgregarIntegrantesInput input, string adminId)
        {
            var grupo = _repositorio.Grupos.GetWithIntegrantes(input.GrupoId);
            if (grupo.Administrador.Id != adminId) throw new InvalidOperationException("Solo los administradores pueden agregar nuevos integrantes a un grupo");

            var usuarios = _repositorio.Usuarios.GetAll();
            var usuariosANotificar = new List<string>();

            foreach (string usuarioId in input.UsuariosIds)
            {
                var user = usuarios.FirstOrDefault(u => u.Id == usuarioId);
                if (user != null)
                {
                    try
                    {
                        grupo.AgregarIntegrante(user);
                        if (user.EstaTranquilo()) usuariosANotificar.Add(user.Id);
                    }
                    catch (ArgumentException e)
                    {
                        Console.WriteLine(e);
                        continue;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                }
            }

            _repositorio.Grupos.Update(grupo);
            _repositorio.Complete();

            Message notif = new Message
            {
                notification = new Message.Notification
                {
                    title = "Has sido añadido a un nuevo grupo",
                    text = "Grupo: " + grupo.Nombre,
                    click_action = "NUEVO_GRUPO"
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

            _notificator.EnviarNotificacion(usuariosANotificar.Distinct().ToArray(), notif);

            return _mapper.Map<GrupoDto>(grupo);

        }
    }
}
