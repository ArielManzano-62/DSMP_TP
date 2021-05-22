using System;
using System.Collections.Generic;
using System.Text;
using static Dominio.Eventos.Evento;

namespace Dominio.Grupos
{
    public class ConfiguracionEvento
    {
        public TipoEvento TipoEvento { get; set; }
        public bool Activado { get; set; }

        public ConfiguracionEvento()
        {

        }
        public ConfiguracionEvento(TipoEvento tipo)
        {
            TipoEvento = tipo;
            Activado = true;
        }

        public ConfiguracionEvento(TipoEvento tipo, bool activado)
        {
            TipoEvento = tipo;
            Activado = activado;
        }
    }
}
