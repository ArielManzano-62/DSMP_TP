using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos.Estado
{
    public class Desviado : EnTranscurso
    {
        public Desviado() : base(TipoEstadoSeguimiento.Desviado) { }

        public override void Encursar(SeguimientoVirtual seguimiento)
        {
            seguimiento.Estado = new EnCurso();
        }
        public override string ToString()
        {
            return "Desviado";
        }
    }
}
