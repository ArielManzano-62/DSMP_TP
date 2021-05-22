using Dominio.Grupos;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos
{
    public class GrupoDto
    {
        public Guid GrupoId { get; set; }
        public string GrupoNombre { get; set; }
        public string FotoUrl { get; set; }
        public DateTime FechaHoraCreacion { get; set; }
        public IntegranteDto Administrador { get; set; }
        public ICollection<IntegranteDto> Integrantes { get; set; }
        public ICollection<RegistroMensaje> HistorialMensajes { get; set; }
    }
}
