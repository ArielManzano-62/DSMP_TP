using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Usuarios.Estados
{
    public class EnEmergencia : EstadoUsuario
    {
        public EnEmergencia() : base(TipoEstadoUsuario.EnEmergencia) { }
        

        public override void FinalizarEvento(Usuario user)
        {
            Evento evento = user.EventoActual;
            if (evento == null) { throw new InvalidOperationException("Esto no deberia suceder: Usuario " + user.Id + " en emergencia sin evento actual"); }
            evento.Finalizar();
            user.Estado = new FinalizandoEvento();
        }

        public override string ToString()
        {
            return "En Emergencia";
        }
    }
}
