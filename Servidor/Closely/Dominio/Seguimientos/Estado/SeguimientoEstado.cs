using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos.Estado
{
    public abstract class SeguimientoEstado
    {
        public enum TipoEstadoSeguimiento
        {
            EnTranscurso,
            Finalizado,
            Desviado,
            EnCurso
        }

        public TipoEstadoSeguimiento TipoEstado { get; protected set; }

        public SeguimientoEstado(TipoEstadoSeguimiento tipo)
        {
            TipoEstado = tipo;
        }

        public virtual bool EsEnTranscurso()
        {
            return false;
        }

        public virtual void Finalizar(SeguimientoVirtual seguimiento)
        {
            throw new InvalidOperationException("No se puede finalizar si ya esta finalizado");
        }

        public virtual Ubicacion ActualizarUbicacion(SeguimientoVirtual seguimiento, double latitud, double longitud)
        {
            throw new InvalidOperationException("No se puede actualizar la ubicación si ya esta finalizado");
        }

        public virtual void Desviar(SeguimientoVirtual seguimiento)
        {
            throw new InvalidOperationException($"No se puede desviar en estado {this.ToString()}");
        }

        public virtual void Encursar(SeguimientoVirtual seguimiento)
        {
            throw new InvalidOperationException($"No se puede encursar en estado {this.ToString()}");
        }


    }
}
