using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos.Estados
{
    public class Finalizado : EstadoEvento
    {
        public Finalizado() : base(TipoEstadoEvento.Finalizado) { }

        public override bool EstaEnTranscurso()
        {
            return false;
        }

        public override void Finalizar(Evento e)
        {
            throw new InvalidOperationException("Este evento ya ha sido finalizado. Evento: " + e.Id);
        }

        public override void Resolver(Evento e, string descripcion, int estado)
        {
            throw new InvalidOperationException("Este evento ya ha sido finalizado. Evento: " + e.Id);
        }

        public override string ToString()
        {
            return "Finalizado";
        }
    }
}
