using Dominio.Seguimientos;
using LogicaNegocio.Seguimientos.NuevoSeguimiento.Validations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace LogicaNegocio.Seguimientos.NuevoSeguimiento
{
    public class NuevoSeguimientoInput
    {
        [Required]
        public Coordenada Origen { get; set; }
        [Required]
        public Coordenada Destino { get; set; }
        [Required]
        public string DireccionDestino { get; set; }
        [Required]
        public ICollection<Coordenada> Waypoints { get; set; }
        [Required]
        public string Modo { get; set; }
        [Required]
        [EnsureMinimumElementsAttribute(1)]
        public ICollection<Guid> GrupoIds { get; set; }
        [Required]
        public string EncodedPolyline { get; set; }
    }
}
