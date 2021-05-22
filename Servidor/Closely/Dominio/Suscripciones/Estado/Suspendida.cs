using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Suscripciones.Estado
{
    public class Suspendida : EstadoSuscripcion
    {
        public Suspendida() : base(EstadoSuscripcionTipo.Suspendida) { }

        public override void Reactivar(Suscripcion suscripcion)
        {
            suscripcion.Estado = new Activa();
        }


        public override string ToString()
        {
            return "Suspendida";
        }
    }
}
