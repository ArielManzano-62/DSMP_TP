using Dominio.Grupos;
using Dominio.Seguimientos.Estado;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Seguimientos
{
    public class SeguimientoVirtual
    {        
        public Guid Id { get; private set; }
        public DateTime FechaHoraInicio { get; private set; }
        public DateTime FechaHoraFin { get; internal set; }
        public Ruta Ruta { get; private set; }
        public Usuario Usuario { get; private set; }
        public SeguimientoEstado Estado { get; internal set; }
        public ICollection<Ubicacion> Ubicaciones { get; private set; } = new List<Ubicacion>();
        public ICollection<Grupo> Grupos { get; }
        private ICollection<GrupoSeguimiento> GrupoSeguimiento { get; } = new List<GrupoSeguimiento>();

        private SeguimientoVirtual()
        {
            Id = Guid.NewGuid();
            FechaHoraInicio = DateTime.Now;
            Estado = new EnCurso();
            Grupos = new JoinCollectionFacade<Grupo, SeguimientoVirtual, GrupoSeguimiento>(this, GrupoSeguimiento);
        }

        public SeguimientoVirtual(Coordenada origen, Coordenada destino, ICollection<Coordenada> puntosIntermedios, string modo, string encodedPolyline, string direccionDestino, Usuario usuario) : this()
        {
            Ruta = new Ruta(origen, destino, puntosIntermedios, modo, encodedPolyline, direccionDestino);
            Usuario = usuario;
        }

        public void Finalizar()
        {
            Estado.Finalizar(this);
        }

        public Ubicacion ActualizarUbicacion(double latitud, double longitud)
        {
            return Estado.ActualizarUbicacion(this, latitud, longitud);
        }

        public void Desviar()
        {
            Estado.Desviar(this);
        }

        public void Encursar()
        {
            Estado.Encursar(this);
        }

        public bool EstaEnTranscurso()
        {
            return Estado.EsEnTranscurso();
        }


    }
}
