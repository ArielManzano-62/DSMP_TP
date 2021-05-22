using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class Asalto : Evento
    {
        public Asalto() : base()
        {
            Tipo = TipoEvento.ASALTO;
        }

        public override string ToString()
        {
            return "Asalto";
        }
    }
}
