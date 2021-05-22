using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Suscripciones.Estado
{
    public class Cancelada : EstadoSuscripcion
    {
        public Cancelada() : base(EstadoSuscripcionTipo.Cancelada) { }

        public override string ToString()
        {
            return "Cancelada";
        }

        public override bool EsCancelada()
        {
            return true;
        }
    }
}
