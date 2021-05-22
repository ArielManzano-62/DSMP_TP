using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos.Estado
{
    public abstract class EnTranscurso : SeguimientoEstado
    {
        public EnTranscurso() : base(TipoEstadoSeguimiento.EnTranscurso) { }

        internal EnTranscurso(TipoEstadoSeguimiento tipo) : base(tipo) { }

        public override Ubicacion ActualizarUbicacion(SeguimientoVirtual seguimiento, double latitud, double longitud)
        {
            var nuevaUbicacion = new Ubicacion(latitud, longitud);
            seguimiento.Ubicaciones.Add(nuevaUbicacion);
            return nuevaUbicacion;
        }

        public override void Finalizar(SeguimientoVirtual seguimiento)
        {
            seguimiento.FechaHoraFin = DateTime.Now;
            seguimiento.Estado = new Finalizado();

        }

        public override bool EsEnTranscurso()
        {
            return true;
        }

        public override string ToString()
        {
            return "En Transcurso";
        }
    }
}
