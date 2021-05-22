using Dominio.Eventos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Estadisticas.MapaCalor
{
    public class ObtenerPuntosDeEventosInteractor : IObtenerPuntosDeEventosInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ObtenerPuntosDeEventosInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public IEnumerable<PuntosDto> ObtenerPuntos(RangoFechasRequest input)
        {
            if (input.Desde == null || input.Hasta == null) throw new ArgumentException("Alguna fecha fue null");
            if (input.Desde >= input.Hasta) throw new ArgumentException("La fecha desde super a fecha hasta");
            if (input.Desde > DateTime.Now) throw new ArgumentOutOfRangeException("La fecha desde fue mayor a la fecha actual");
            if (input.Hasta > DateTime.Now.AddDays(2)) throw new ArgumentOutOfRangeException("La fecha hasta es mayor que dos dias de hoy en adelante");

            var eventos = _repositorio.Eventos.ObtenerEnRango(input.Desde, input.Hasta);

            ICollection<PuntosDto> puntos = new List<PuntosDto>();
            foreach (Evento e in eventos)
            {
                if (e.Tipo != Evento.TipoEvento.ASALTO) continue;
                var ubicacion = e.Ubicaciones.OrderBy(u => u.FechaHora).FirstOrDefault();
                if (ubicacion == null) continue;
                puntos.Add(new PuntosDto
                {
                    Latitude = ubicacion.Latitude,
                    Longitude = ubicacion.Longitude
                });
            }

            return puntos;
        }
    }
}
