using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Suscripciones.Estado
{
    public class Activa : EstadoSuscripcion
    {
        public Activa() : base(EstadoSuscripcionTipo.Activa) { }

        public override void Cancelar(Suscripcion suscripcion, string motivoCancelacion)
        {
            suscripcion.MotivoCancelacion = motivoCancelacion;
            suscripcion.Estado = new Cancelada();
        }

        public override void Suspender(Suscripcion suscripcion)
        {
            suscripcion.Estado = new Suspendida();
        }

        public override bool EsActiva()
        {
            return true;
        }

        public override string ToString()
        {
            return "Activa";
        }

    }
}
