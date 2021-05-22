using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarEstado
{
    public class ConsultarEstadoOutput
    {
        public string UsuarioEstado { get; set; }

        public object Evento { get; set; }


        public class ConsultarEstadoEventoDto
        {
            public Guid EventoId { get; set; }
            public string TipoEvento { get; set; }
            public string NombreUsuario { get; set; }
            public string ApellidoUsuario { get; set; }
            public DateTime FechaHoraInicio { get; set; }
            public DateTime FechaHoraFin { get; set; }
            public string Estado { get; set; }
            public ICollection<RegistroMensaje> Mensajes { get; set; }
            public ICollection<Ubicacion> Ubicaciones { get; set; }
        }
    }
}
