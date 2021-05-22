using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Seguimientos.ActualizarUbicacion
{
    public class ActualizarUbicacionOutput
    {
        public string Evento { get; set; } = "UPDATE";
        public Ubicacion Ubicacion { get; set; }

        public ActualizarUbicacionOutput(Ubicacion ubicacion)
        {
            Ubicacion = ubicacion;
        }

        public ActualizarUbicacionOutput(string evento, Ubicacion ubicacion) : this(ubicacion)
        {
            Evento = evento;
        }
    }
}
