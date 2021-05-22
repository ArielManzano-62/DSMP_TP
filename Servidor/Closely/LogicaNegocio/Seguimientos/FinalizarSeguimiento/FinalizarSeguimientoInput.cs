using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace LogicaNegocio.Seguimientos.FinalizarSeguimiento
{
    public class FinalizarSeguimientoInput
    {
        [Required]
        public Guid SeguimientoId { get; set; }
        [Required]
        [StringLength(4, MinimumLength = 4)]
        [RegularExpression("^[0-9]*$")]
        public string Codigo { get; set; }
    }
}
