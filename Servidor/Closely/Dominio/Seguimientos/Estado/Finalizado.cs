using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos.Estado
{
    public class Finalizado : SeguimientoEstado
    {
        public Finalizado() : base(TipoEstadoSeguimiento.Finalizado) { }

        public override string ToString()
        {
            return "Finalizado";
        }
    }
}
