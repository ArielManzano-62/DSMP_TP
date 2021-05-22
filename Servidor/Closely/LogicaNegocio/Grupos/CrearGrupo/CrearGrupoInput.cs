using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.CrearGrupo
{
    public class CrearGrupoInput
    {
        public IFormFile File { get; set; }
        public string GrupoNombre { get; set; }
        public string UsuariosId { get; set; }
    }
}
