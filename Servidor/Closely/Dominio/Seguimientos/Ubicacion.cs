using System;

namespace Dominio.Seguimientos
{
    public class Ubicacion
    {
        public Coordenada Posicion { get; private set; }
        public DateTime FechaHora { get; private set; }

        private Ubicacion()
        {
            FechaHora = DateTime.Now;
        }

        public Ubicacion(double latitud, double longitud) : this()
        {
            Posicion = new Coordenada(latitud, longitud);
        }

        public override string ToString()
        {
            return $"FechaHora: {this.FechaHora} \nPosicion: [{this.Posicion.Latitude}, {this.Posicion.Longitude}]";
        }


    }
}