using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ConsultarEvento
{
    public class EventoDto
    {
        public Guid Id { get; set; }
        public object Afectado { get; set; }
        public string TipoEvento { get; set; }
        public DateTime FechaHora { get; set; }
        public ICollection<Ubicacion> Ubicaciones { get; set; }
        public ICollection<RegistroMensaje> Mensajes { get; set; }
    }
}
