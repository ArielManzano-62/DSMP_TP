using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Suscripciones.Estado
{
    public abstract class EstadoSuscripcion
    {
        public enum EstadoSuscripcionTipo
        {
            EsperandoAprobacion,
            Activa,
            Suspendida,
            Cancelada
        }

        public EstadoSuscripcionTipo Tipo { get; set; }
        
        protected EstadoSuscripcion() { }

        protected EstadoSuscripcion(EstadoSuscripcionTipo tipo)
        {
            Tipo = tipo;
        }

        public virtual void Aprobar(Suscripcion suscripcion)
        {
            throw new InvalidOperationException($"No se puede aprobar en estado {this.ToString()}");
        }
        public virtual void Cancelar(Suscripcion suscripcion, string motivoCancelacion)
        {
            throw new InvalidOperationException($"No se puede cancelar en estado {this.ToString()}");
        }

        public virtual void Suspender(Suscripcion suscripcion)
        {
            throw new InvalidOperationException($"No se puede suspender en estado {this.ToString()}");
        }

        public virtual void Reactivar(Suscripcion suscripcion)
        {
            throw new InvalidOperationException($"No se puede reactivar en estado {this.ToString()}");
        }

        public virtual bool EsActiva()
        {
            return false;
        }

        public virtual bool EsCancelada()
        {
            return false;
        }

        public virtual bool EsEsperandoAprobacion()
        {
            return false;
        }

        public override bool Equals(object obj)
        {
            EstadoSuscripcion estado = (EstadoSuscripcion)obj;
            if (estado.GetType() == this.GetType())
                return true;
            return false;
        }
    }
}
