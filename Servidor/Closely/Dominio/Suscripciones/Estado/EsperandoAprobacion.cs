using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Suscripciones.Estado
{
    public class EsperandoAprobacion : EstadoSuscripcion
    {
        public EsperandoAprobacion() : base(EstadoSuscripcionTipo.EsperandoAprobacion) { }

        public override void Aprobar(Suscripcion suscripcion)
        {
            suscripcion.FechaAprobacion = DateTime.Now;
            suscripcion.Estado = new Activa();
        }

        public override bool EsEsperandoAprobacion()
        {
            return true;
        }

        public override string ToString()
        {
            return "EsperandoAprobacion";
        }
    }
}
