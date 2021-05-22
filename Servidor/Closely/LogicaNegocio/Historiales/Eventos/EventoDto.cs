using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Eventos
{
    public class EventoDto
    {
        public Guid Id { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public string TipoEvento { get; set; }
        public ICollection<Ubicacion> Ubicaciones { get; set; }
        public string Estado { get; set; }
        public object Usuario { get; set; }

    }
}
