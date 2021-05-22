using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class Incendio : Evento
    {
        public Incendio() : base()
        {
            Tipo = TipoEvento.INCENDIO;
        }

        public override string ToString()
        {
            return "Incendio";
        }
    }
}
