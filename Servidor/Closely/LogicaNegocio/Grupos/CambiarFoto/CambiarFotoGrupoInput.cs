using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace LogicaNegocio.Grupos.CambiarFoto
{
    public class CambiarFotoGrupoInput
    {
        [Required]
        public IFormFile File { get; set; }
        [Required]
        public Guid GrupoId { get; set; }
    }
}