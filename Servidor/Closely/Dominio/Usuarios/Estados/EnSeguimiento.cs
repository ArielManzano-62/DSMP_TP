using Dominio.Eventos;
using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Usuarios.Estados
{
    public class EnSeguimiento : EstadoUsuario
    {
        public EnSeguimiento() : base(TipoEstadoUsuario.EnSeguimiento) { }

        public override void FinalizarSeguimiento(Usuario user)
        {
            if (user.SeguimientoActual == null) throw new InvalidOperationException($"No deberia estar en estado {this.ToString()} y no tener un seguimiento actual");
            user.SeguimientoActual.Finalizar();
            user.SeguimientoActual = null;
            user.Estado = new Tranquilo();
        }

        public override bool EsEnSeguimiento()
        {
            return true;
        }

        public override string ToString()
        {
            return "En Seguimiento";
        }

    }
}
