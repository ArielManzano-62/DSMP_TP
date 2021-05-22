using Dominio.Eventos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Historiales.Eventos.HistorialGrupo
{
    public class ObtenerHistorialEventosGrupoInteractor : IObtenerHistorialEventosGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ObtenerHistorialEventosGrupoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public IEnumerable<EventoDto> GetHisotrial(string userId, Guid grupoId)
        {
            if (userId == null || userId == "") throw new ArgumentException("No proporciono UserId");
            if (grupoId == null || grupoId == Guid.Empty) throw new ArgumentException("No proporciono GrupoId");

            var grupo = _repositorio.Grupos.GetWithEventosAndUsers(grupoId);
            if (grupo == null) throw new ArgumentException("No existe grupo con ese Id");
            var user = _repositorio.Usuarios.Get(userId);
            if (user == null) throw new ArgumentException("No existe usuario con ese Id");
            var users = _repositorio.Usuarios.GetAllWithEventos();

            if (!grupo.Integrantes.Contains(user)) throw new UnauthorizedAccessException("El usuario no pertenece a dicho grupo");

            ICollection<EventoDto> eventos = new List<EventoDto>();

            foreach (Evento ev in grupo.Eventos)
            {
                var usuarioEvento = users.First(u => u.Eventos.Any(e => e.Id == ev.Id));
                var eventoDto = new EventoDto
                {
                    Id = ev.Id,
                    Estado = ev.Estado.ToString(),
                    TipoEvento = ev.ToString(),
                    FechaHoraInicio = ev.FechaHoraInicio,
                    FechaHoraFin = ev.FechaHoraFin,
                    Ubicaciones = ev.Ubicaciones,
                    Usuario = new
                    {
                        Id = usuarioEvento.Id,
                        Nombre = usuarioEvento.Nombre,
                        Apellido = usuarioEvento.Apellido,
                        Foto = usuarioEvento.FotoUrl
                    }
                };
                eventos.Add(eventoDto);
            }

            return eventos;
        }
    }
}
