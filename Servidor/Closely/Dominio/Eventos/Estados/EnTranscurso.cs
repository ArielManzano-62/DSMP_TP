using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos.Estados
{
    public class EnTranscurso : EstadoEvento
    {
        public EnTranscurso() : base(TipoEstadoEvento.EnTranscurso)
        {

        }

        public override void Finalizar(Evento e)
        {
            e.FechaHoraFin = DateTime.Now;
            EstadoEvento nuevoEstado = new EsperandoResolucion();
            e.Estado = nuevoEstado;
        }

        public override bool EstaEnTranscurso()
        {
            return true;
        }

        public override void Resolver(Evento e, string descripcion, int estado)
        {
            throw new InvalidOperationException("No se puede Resolver cuando esta en transcurso. Debe estar finalizado el evento");
        }

        public override void ActualizarUbicacion(Evento e, double latitude, double longitude)
        {
            e.Ubicaciones.Add(new Ubicacion(latitude, longitude));
        }

        public override string ToString()
        {
            return "En Transcurso";
        }
    }
}
