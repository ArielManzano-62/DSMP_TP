using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class Ubicacion
    {
        private double latitude;
        private double longitude;

        public double Latitude
        {
            get { return latitude; }

            private set
            {
                if (value > 90)
                    throw new ArgumentException("Latitud debe ser menor a 90°");
                if (value < -90)
                    throw new ArgumentException("Latitud debe ser mayor a -90°");
                latitude = value;

            }
        }
        public double Longitude
        {
            get { return longitude; }

            private set
            {
                if (value > 180)
                    throw new ArgumentException("Longitud debe ser menor a 180°");
                if (value < -180)
                    throw new ArgumentException("Longitud debe ser mayor a -180°");
                longitude = value;
            }
        }
        public DateTime FechaHora { get; private set; }

        private Ubicacion()
        {
            this.FechaHora = DateTime.Now;
        }

        public Ubicacion(double latitude, double longitude) : this()
        {
            this.Latitude = latitude;
            this.Longitude = longitude;
        }
    }
}
