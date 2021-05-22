using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos
{
    public class Ruta
    {
        public Coordenada Origen { get; private set; }
        public Coordenada Destino { get; private set; }
        public string Modo { get; private set; }
        public ICollection<Coordenada> Waypoints { get; private set; }
        public string EncodedPolyline { get; private set; }
        public string DireccionDestino { get; private set; }

        private Ruta()
        {
        }

        public Ruta(Coordenada origen, Coordenada destino, ICollection<Coordenada> waypoints, string modo, string encodedPolyline, string direccionDestino)
        {
            Origen = origen;
            Destino = destino;
            Waypoints = waypoints;
            Modo = modo;
            EncodedPolyline = encodedPolyline;
            DireccionDestino = direccionDestino;
        }
    }
}
