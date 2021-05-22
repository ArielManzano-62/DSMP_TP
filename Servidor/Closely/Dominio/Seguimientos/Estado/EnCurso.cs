using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos.Estado
{
    public class EnCurso : EnTranscurso
    {
        public EnCurso() : base(TipoEstadoSeguimiento.EnCurso) { }

        public override void Desviar(SeguimientoVirtual seguimiento)
        {
            seguimiento.Estado = new Desviado();
        }

        public override string ToString()
        {
            return "En Curso";
        }

    }
}
