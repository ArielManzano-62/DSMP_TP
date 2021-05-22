using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos.Factories
{
    public abstract class EventoFactory
    {
        protected Usuario _user;

        public EventoFactory WithUser(Usuario usuario)
        {
            if (usuario != null)
            {
                _user = usuario;
                return this;
            }
            throw new ArgumentNullException("usuario", "Usuario no puede ser null");

        }

        public abstract Evento Crear();    
    }
}
