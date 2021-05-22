using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.EliminarIntegrante
{
    public class EliminarIntegranteInput
    {
        public Guid GrupoId { get; set; }
        public string UsuarioId { get; set; }
    }
}
