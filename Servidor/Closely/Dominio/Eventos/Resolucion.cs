using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class Resolucion
    {
        public enum EstadoFinalUsuario
        {
            NoData,
            MuyMal,
            Mal,
            Regular,
            Bien,
            MuyBien
        }

        public Resolucion(string descripcion, EstadoFinalUsuario? estadoFinal)
        {
            Descripcion = descripcion;
            if (estadoFinal == null)
                EstadoFinal = EstadoFinalUsuario.NoData;
            else
                EstadoFinal = estadoFinal;
        }

        public string Descripcion { get; set; }
        public EstadoFinalUsuario? EstadoFinal { get; set; }
    }
}
