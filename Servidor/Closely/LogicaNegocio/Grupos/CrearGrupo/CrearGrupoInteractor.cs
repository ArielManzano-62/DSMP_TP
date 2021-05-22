using AutoMapper;
using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Repositorio;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Grupos.CrearGrupo
{
    public class CrearGrupoInteractor : ICrearGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IImageUploader _imageUploader;
        private readonly IMapper _mapper;
        private readonly INotificatorInteractor _notificator;
        public CrearGrupoInteractor(IUnitOfWork repo, IMapper mapper, IImageUploader imageUploader, INotificatorInteractor notificator)
        {
            _repositorio = repo;
            _mapper = mapper;
            _imageUploader = imageUploader;
            _notificator = notificator;
        }

        public async Task<GrupoDto> CrearGrupo(CrearGrupoInput input, string adminId)
        {
            var admin = _repositorio.Usuarios.Get(adminId);
            var nuevoGrupo = new Grupo(input.GrupoNombre, admin);
            nuevoGrupo.AgregarIntegrante(admin);
            var usuariosIds = JsonConvert.DeserializeObject<ICollection<string>>(input.UsuariosId);
            ICollection<Usuario> integrantesList = (ICollection<Usuario>)_repositorio.Usuarios.GetAll();

            foreach (string usuarioId in usuariosIds)
            {
                var user = integrantesList.FirstOrDefault(u => u.Id == usuarioId);
                if (user != null)
                {
                    try
                    {
                        nuevoGrupo.AgregarIntegrante(user);
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
            if (input.File != null)
            {
                nuevoGrupo.FotoUrl = await _imageUploader.SubirImagen(input.File);   
            }
            

            _repositorio.Grupos.Add(nuevoGrupo);
            _repositorio.Complete();
            

            Message notif = new Message
            {
                notification = new Message.Notification
                {
                    title = "Has sido añadido a un nuevo grupo",
                    text = "Grupo: " + nuevoGrupo.Nombre,
                    click_action = "NUEVO_GRUPO"
                },
                data = new
                {
                    Id = nuevoGrupo.Id,
                    Nombre = nuevoGrupo.Nombre,
                    FechaHora = nuevoGrupo.FechaHoraCreacion,                    
                    Foto = nuevoGrupo.FotoUrl
                },
                android = new
                {
                    priority = "high"
                }
            };

            _notificator.EnviarNotificacion(usuariosIds.ToArray(), notif);


            return _mapper.Map<GrupoDto>(nuevoGrupo);



        }
    }
}
