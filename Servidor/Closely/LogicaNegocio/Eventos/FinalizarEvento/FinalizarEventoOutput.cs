using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.FinalizarEvento
{
    public class FinalizarEventoOutput
    {
        public Guid EventoId { get; set; }
        public string TipoEvento { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidoUsuario { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public string Estado { get; set; }
    }
}
