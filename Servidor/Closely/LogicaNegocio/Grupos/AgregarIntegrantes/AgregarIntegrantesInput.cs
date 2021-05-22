using LogicaNegocio.Seguimientos.NuevoSeguimiento.Validations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace LogicaNegocio.Grupos.AgregarIntegrantes
{
    public class AgregarIntegrantesInput
    {
        [Required]
        public Guid GrupoId { get; set; }
        [Required]
        [EnsureMinimumElementsAttribute(1)]
        public ICollection<string> UsuariosIds { get; set; }
    }
}
