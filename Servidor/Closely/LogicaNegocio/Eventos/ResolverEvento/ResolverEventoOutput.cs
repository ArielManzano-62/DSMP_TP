using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ResolverEvento
{
    public class ResolverEventoOutput
    {
        public Guid EventoId { get; set; }
        public string TipoEvento { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidoUsuario { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public string Descripcion { get; set; }
        public string EstadoFinal { get; set; }
    }
}
