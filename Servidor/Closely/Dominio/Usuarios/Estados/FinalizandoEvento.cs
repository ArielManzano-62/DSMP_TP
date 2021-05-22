using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Usuarios.Estados
{
    public class FinalizandoEvento : EstadoUsuario
    {
        public FinalizandoEvento() : base(TipoEstadoUsuario.FinalizandoEvento) { }

        public override Evento ResolverEvento(Usuario user, string descripcion, int estadoFinal)
        {
            Evento evento = user.EventoActual;
            if (evento == null) { throw new InvalidOperationException("No deberia estar en estado FinalizandoEvento y no poseer evento actual el usuario"); }
            evento.Resolver(descripcion, estadoFinal);
            user.EventoActual = null;
            user.Estado = new Tranquilo();
            return evento;
        }

        public override string ToString()
        {
            return "Finalizando Evento";
        }
    }
}
