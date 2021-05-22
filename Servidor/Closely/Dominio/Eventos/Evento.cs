using Dominio.Eventos.Estados;
using Dominio.Grupos;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dominio.Eventos
{
    public abstract class Evento
    {
        public enum TipoEvento
        {
            ASALTO,
            EMERGENCIAMEDICA,
            INCENDIO
        }

        public Guid Id { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public EstadoEvento Estado { get; set; }
        public Resolucion Resolucion { get; set; }
        private ICollection<EventoGrupo> GruposEvento { get; } = new List<EventoGrupo>();
        public ICollection<RegistroMensaje> Mensajes { get; private set; }
        public TipoEvento Tipo { get; set; }
        public ICollection<Grupo> Notificados { get; }
        public ICollection<Ubicacion> Ubicaciones { get; set; } = new List<Ubicacion>();

        public Evento()
        {
            Id = Guid.NewGuid();
            Notificados = new JoinCollectionFacade<Grupo, Evento, EventoGrupo>(this, GruposEvento);
            Estado = new EnTranscurso();
            FechaHoraInicio = DateTime.Now;
            Mensajes = new List<RegistroMensaje>();
        }

        public virtual void Finalizar()
        {
            Estado.Finalizar(this);
        }

        public virtual bool EnTranscurso()
        {
            return Estado.EstaEnTranscurso();
        }

        public virtual void Resolver(string descripcion, int estadoFinal)
        {
            Estado.Resolver(this, descripcion, estadoFinal);
        }

        public virtual void ActualizarUbicacion(double latitude, double longitude)
        {
            Estado.ActualizarUbicacion(this, latitude, longitude);
        }

        public RegistroMensaje NuevoMensaje(string message, Usuario usuario)
        {            
            if (message.Equals("")) throw new ArgumentException("No se pueden enviar mensajes vacios");
            int nroUltimoMensaje = 1;
            var ultimoMensaje = Mensajes.OrderBy(hm => hm.NroMensaje).LastOrDefault();
            if (ultimoMensaje != null)
                nroUltimoMensaje = ultimoMensaje.NroMensaje + 1;
            var nuevoMensaje = new RegistroMensaje(this.Id, nroUltimoMensaje, usuario, message);
            Mensajes.Add(nuevoMensaje);
            return nuevoMensaje;
        }
    }
}
