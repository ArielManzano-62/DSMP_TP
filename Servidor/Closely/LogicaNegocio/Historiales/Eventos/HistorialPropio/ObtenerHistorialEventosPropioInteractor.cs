using Dominio.Eventos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Historiales.Eventos.HistorialPropio
{
    public class ObtenerHistorialEventosPropioInteractor : IObtenerHistorialEventosPropioInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ObtenerHistorialEventosPropioInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public IEnumerable<EventoDto> GetHistorialEventos(string userId)
        {
            if (userId == null || userId == "") throw new ArgumentException("No se proporciono Id");
            var user = _repositorio.Usuarios.GetWithEventos(userId);
            if (user == null) throw new ArgumentException("No existe ese usuario");

            ICollection<EventoDto> eventos = new List<EventoDto>();

            foreach (Evento ev in user.Eventos)
            {
                var eventoDto = new EventoDto
                {
                    Id = ev.Id,
                    Estado = ev.Estado.ToString(),
                    TipoEvento = ev.ToString(),
                    FechaHoraInicio = ev.FechaHoraInicio,
                    FechaHoraFin = ev.FechaHoraFin,
                    Usuario = new
                    {
                        Id = user.Id,
                        Nombre = user.Nombre,
                        Apellido = user.Apellido,
                        Foto = user.FotoUrl
                    },
                    Ubicaciones = ev.Ubicaciones
                };
                eventos.Add(eventoDto);
            }

            return eventos;
        }
    }
}
