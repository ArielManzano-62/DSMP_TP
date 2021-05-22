using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos
{
    public class Coordenada
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        private Coordenada() { }

        public Coordenada(double latitud, double longitud)
        {
            Latitude = latitud;
            Longitude = longitud;
        }
    }
}
