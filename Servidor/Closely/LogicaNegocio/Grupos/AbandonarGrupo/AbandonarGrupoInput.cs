using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.AbandonarGrupo
{
    public class AbandonarGrupoInput
    {
        public Guid GrupoId { get; set; }
        public string UsuarioId { get; set; }
    }
}
