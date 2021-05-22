using Dominio.Eventos;
using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Usuarios.Estados
{
    public abstract class EstadoUsuario
    {
        public enum TipoEstadoUsuario
        {
            EnEmergencia,
            FinalizandoEvento,
            Tranquilo,
            EnSeguimiento,
        }

        public TipoEstadoUsuario Tipo { get; set; }

        public EstadoUsuario(TipoEstadoUsuario tipo)
        {
            Tipo = tipo;
        }

        public virtual bool EstaTranquilo()
        {
            return false;
        }

        public virtual bool EsEnSeguimiento()
        {
            return false;
        }

        public virtual Evento EnviarEvento(string tipoEvento, Usuario user)
        {
            throw new InvalidOperationException($"No se puede enviar un evento en estado {this.ToString()}");
        }
        public virtual void FinalizarEvento(Usuario user)
        {
            throw new InvalidOperationException($"No se puede finalizar un evento en estado {this.ToString()}");
        }
        public virtual Evento ResolverEvento(Usuario user, string descripcion, int estadoFinal)
        {
            throw new InvalidOperationException($"No se puede resolver un evento en estado {this.ToString()}");
        }
        public virtual void IniciarSeguimiento(Usuario user, SeguimientoVirtual seguimiento)
        {
            throw new InvalidOperationException($"No se puede iniciar un seguimiento virtual en estado {this.ToString()}");
        }
        public virtual void FinalizarSeguimiento(Usuario user)
        {
            throw new InvalidOperationException($"No se puede finalizar un seguimiento virtual en estado {this.ToString()}");
        }
    }
}
