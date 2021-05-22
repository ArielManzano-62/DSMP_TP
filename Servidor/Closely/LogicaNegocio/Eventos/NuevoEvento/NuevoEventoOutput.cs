using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.NuevoEvento
{
    public class NuevoEventoOutput
    {
        public Guid EventoId { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidoUsuario { get; set; }
        public string TipoEvento { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public string Estado { get; set; }
        public ICollection<RegistroMensaje> Mensajes { get; set; }
        public ICollection<Ubicacion> Ubicaciones { get; set; }
    }
}
