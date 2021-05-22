using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class Mensaje
    {
        public string Contenido { get; private set; }
        public string NombreEmisor { get; set; }

        public Mensaje(string contenido, string nombreEmisor)
        {
            NombreEmisor = nombreEmisor;
            Contenido = contenido;
        }
    }
}
