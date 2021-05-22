using Dominio.Eventos;
using Dominio.Usuarios;
using Dominio.Usuarios.Estados;
using LogicaNegocio.Repositorio.Aggregates;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Respositorio.Aggregates
{
    public class UsuarioRepositorio : Repositorio<Usuario>, IUsuarioRepositorio
    {
        public UsuarioRepositorio(DbContext context) : base(context) { }

        
        public Usuario GetUsuarioConEstadoYGrupos(string userId)
        {
            return Context.Set<Usuario>()
                .Include("GrupoUsuarios.Grupo.GrupoUsuarios.Usuario")
                .Where(e => e.Id == userId)
                .FirstOrDefault();
        }

        public Usuario GetUsuarioByEventoActual(Evento evento)
        {
            return Context.Set<Usuario>().Where(u => u.EventoActual.Id == evento.Id).FirstOrDefault();
        }

        public Usuario GetUsuarioConEventoYGrupos(string userId)
        {
            return Context.Set<Usuario>()
                .Where(u => u.Id == userId)
                .Include("EventoActual.GruposEvento.Grupo.GrupoUsuarios.Usuario")
                .FirstOrDefault();
        }

        public Usuario GetUsuarioConEvento(string userId)
        {
            return Context.Set<Usuario>()
                .Where(u => u.Id == userId)
                .Include(u => u.EventoActual)
                .FirstOrDefault();
        }

        public Usuario GetWithEventos(string userId)
        {
            return Context.Set<Usuario>().Where(u => u.Id == userId).Include(u => u.Eventos).FirstOrDefault();
        }

        public Usuario GetByEmail(string email)
        {
            return Context.Set<Usuario>().FirstOrDefault(i => i.Email.Equals(email));
        }

        public Usuario GetWithSuscripciones(string userId)
        {
            return Context.Set<Usuario>().Where(u => u.Id == userId).Include("UsuarioSuscripciones.Suscripcion").FirstOrDefault();
        }

        public Usuario GetWithEventoYSeguimiento(string userId)
        {
            return Context.Set<Usuario>().Where(u => u.Id == userId).Include(u => u.EventoActual).Include(u => u.SeguimientoActual).FirstOrDefault();
        }

        public ICollection<Usuario> GetAllWithSuscripciones()
        {
            return Context.Set<Usuario>().Include("UsuarioSuscripciones.Suscripcion").ToList();
        }

        public ICollection<Usuario> GetAllWithEventos()
        {
            return Context.Set<Usuario>().Include(u => u.Eventos).ToList();
        }

        public Usuario GetWithSeguimientos(string userId)
        {
            return Context.Set<Usuario>().Where(u => u.Id == userId).Include("Seguimientos.GrupoSeguimiento.Grupo").Include("Seguimientos.Usuario").FirstOrDefault();
        }
    }
}
