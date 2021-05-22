using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class EmergenciaMedica : Evento
    {
        public EmergenciaMedica() : base()
        {
            Tipo = TipoEvento.EMERGENCIAMEDICA;
        }

        public override string ToString()
        {
            return "Emergencia Medica";
        }
    }
}
