using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Seguimientos
{
    public class SeguimientoVirtualDto
    {
        public Guid Id { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public Ruta Ruta { get; set; }
        public UsuarioDto Usuario { get; set; }
        public ICollection<Ubicacion> Ubicaciones { get; set; }
        public string Estado { get; set; }
        public ICollection<GrupoDto> Grupos { get; set; }

        public class UsuarioDto
        {
            public string Id { get; set; }
            public string Nombre { get; set; }
            public string Apellido { get; set; }
            public string FotoUrl { get; set; }
        }

        public class GrupoDto
        {
            public Guid Id { get; set; }
            public string Nombre { get; set; }
            public string FotoUrl { get; set; }
        }
    }
}
