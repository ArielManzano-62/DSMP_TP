using Dominio.Grupos;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio
{
    public class GrupoUsuario : IJoinEntity<Usuario>, IJoinEntity<Grupo>
    {
        public string UsuarioId { get; set; }
        public virtual Usuario Usuario { get; set; }
        Usuario IJoinEntity<Usuario>.Navigation
        {
            get => Usuario;
            set => Usuario = value;
        }

        public Guid GrupoId { get; set; }
        public virtual Grupo Grupo { get; set; }
        Grupo IJoinEntity<Grupo>.Navigation
        {
            get => Grupo;
            set => Grupo = value;
        }
    }
}
