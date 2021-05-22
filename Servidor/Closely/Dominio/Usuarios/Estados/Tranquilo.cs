using Dominio.Eventos;
using Dominio.Eventos.Factories;
using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Usuarios.Estados
{
    public class Tranquilo : EstadoUsuario
    {
        public Tranquilo() : base(TipoEstadoUsuario.Tranquilo) { }

        public override bool EstaTranquilo()
        {
            return true;
        }

        public override Evento EnviarEvento(string tipoEvento, Usuario user)
        {
            EventoFactory factory = new EventoSimpleFactory().DeterminarFactory(tipoEvento);

            factory.WithUser(user);

            Evento nuevoEvento = factory.Crear();

            user.Estado = new EnEmergencia();
            user.EventoActual = nuevoEvento;
            user.Eventos.Add(nuevoEvento);

            return nuevoEvento;
        }

        public override void IniciarSeguimiento(Usuario user, SeguimientoVirtual seguimiento)
        {
            user.SeguimientoActual = seguimiento;
            user.Estado = new EnSeguimiento();
            user.Seguimientos.Add(seguimiento);
        }

        public override string ToString()
        {
            return "Tranquilo";
        }
    }
}
