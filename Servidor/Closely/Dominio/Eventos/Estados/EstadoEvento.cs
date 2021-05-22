using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos.Estados
{
    public abstract class EstadoEvento
    {
        public TipoEstadoEvento TipoEstado { get; set; }

        public enum TipoEstadoEvento
        {
            EnTranscurso,
            EsperandoResolucion,
            Finalizado
        }

        public EstadoEvento(TipoEstadoEvento tipoEstado)
        {
            TipoEstado = tipoEstado;
        }

        public abstract void Finalizar(Evento e);

        public abstract bool EstaEnTranscurso();

        public abstract void Resolver(Evento e, string descripcion, int estado);

        public virtual void ActualizarUbicacion(Evento e, double latitude, double longitude)
        {
            throw new InvalidOperationException("No se puede actualizar ubicación si el evento no está estado EnTranscurso");
        }



    }
}
