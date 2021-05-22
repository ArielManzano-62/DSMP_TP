using Dominio.Eventos;
using Dominio.Seguimientos;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static Dominio.Eventos.Evento;

namespace Dominio.Grupos
{
    public class Grupo
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string FotoUrl { get; set; }
        public DateTime FechaHoraCreacion { get; set; }
        public Usuario Administrador { get; private set; }
        public ICollection<RegistroMensaje> HistorialMensajes { get; } = new List<RegistroMensaje>();
        public ICollection<ConfiguracionGrupo> Configuraciones { get; set; } = new List<ConfiguracionGrupo>();
        private ICollection<GrupoUsuario> GrupoUsuarios { get; } = new List<GrupoUsuario>();
        private ICollection<EventoGrupo> GruposEvento { get; } = new List<EventoGrupo>();
        private ICollection<GrupoSeguimiento> GrupoSeguimiento { get; } = new List<GrupoSeguimiento>();
        public ICollection<Usuario> Integrantes { get; }
        public ICollection<Evento> Eventos { get; }
        public ICollection<SeguimientoVirtual> Seguimientos { get; }


        public Grupo()
        {
            Id = Guid.NewGuid();
            FechaHoraCreacion = DateTime.Now;
            Eventos = new JoinCollectionFacade<Evento, Grupo, EventoGrupo>(this, GruposEvento);
            Integrantes = new JoinCollectionFacade<Usuario, Grupo, GrupoUsuario>(this, GrupoUsuarios);
            Seguimientos = new JoinCollectionFacade<SeguimientoVirtual, Grupo, GrupoSeguimiento>(this, GrupoSeguimiento);
            FotoUrl = "https://closely.s3.sa-east-1.amazonaws.com/groupavatar2.png";
        }

        public Grupo(string nombre, Usuario admin) : this()
        {
            Nombre = nombre;
            Administrador = admin;
        }

        public Grupo (string nombre, Usuario admin, string fotoUrl) : this(nombre, admin)
        {
            FotoUrl = fotoUrl;
        }

        public void Abandonar(Usuario user)
        {
            if (!Integrantes.Contains(user)) throw new ArgumentException($"El grupo no contiene al integrante con Id {user.Id}");
            Integrantes.Remove(user);
            Configuraciones.Remove(Configuraciones.FirstOrDefault(c => c.UsuarioId.Equals(user.Id)));
            if (Administrador.Equals(user))
            {
                var i = Integrantes.FirstOrDefault();
                if (i != null)
                {
                    Administrador = i;
                }
            }
            //TODO: Agregar Mensaje y retonarlo (mensaje o accion)
        }

        public void AgregarIntegrante(Usuario user)
        {
            if (Integrantes.Contains(user)) return;
            Integrantes.Add(user);
            Configuraciones.Add(new ConfiguracionGrupo(user.Id));
        }

        public RegistroMensaje NuevoMensaje(string message, Usuario integrante)
        {
            if (!Integrantes.Contains(integrante)) { throw new UnauthorizedAccessException($"El integrante con Id {integrante.Id} y nombre {integrante.Nombre} no pertenece al grupo"); }
            if (message.Equals("")) throw new ArgumentException("No se pueden enviar mensajes vacios");
            int nroUltimoMensaje = 1;
            var ultimoMensaje = HistorialMensajes.OrderBy(hm => hm.NroMensaje).LastOrDefault();
            if (ultimoMensaje != null)
                nroUltimoMensaje = ultimoMensaje.NroMensaje + 1;
            var nuevoMensaje = new RegistroMensaje(this.Id, nroUltimoMensaje, integrante, message);
            HistorialMensajes.Add(nuevoMensaje);
            return nuevoMensaje;
        }

        public bool IntegranteTieneActivadoEvento(string userId, TipoEvento tipoEvento)
        {
            ConfiguracionGrupo config = Configuraciones.FirstOrDefault(c => c.UsuarioId.Equals(userId));
            if (config == null) return false;
            ConfiguracionEvento configEvento = config.ConfiguracionesEvento.FirstOrDefault(ce => ce.TipoEvento == tipoEvento);
            if (configEvento == null) return false;
            return configEvento.Activado;
        }

        public void ConfigurarParaUsuario(Usuario user, bool asalto, bool emergenciaMedica, bool incendio)
        {
            var config = Configuraciones.FirstOrDefault(c => c.UsuarioId.Equals(user.Id));
            if (config == null) return;

            Configuraciones.Remove(config);

            var nuevaConfig = new ConfiguracionGrupo(user.Id, asalto, emergenciaMedica, incendio);
            Configuraciones.Add(nuevaConfig);

        }


    }
}
