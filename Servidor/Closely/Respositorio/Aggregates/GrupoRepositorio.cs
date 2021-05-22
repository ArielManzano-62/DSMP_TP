using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio.Aggregates;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Respositorio.Aggregates
{
    public class GrupoRepositorio : Repositorio<Grupo>, IGrupoRepositorio
    {
        public GrupoRepositorio(DbContext context) : base(context) { }

        public ICollection<Grupo> GetGroupsOfMembersWithMembers(Usuario user)
        {
            ICollection<Grupo> grupos = Context.Set<Grupo>().Include("GrupoUsuarios.Usuario").ToList();
            ICollection<Grupo> gruposMember = grupos.Where(g => g.Integrantes.Any(i => i.Id == user.Id)).ToList();

            return gruposMember;
        }

        public ICollection<Grupo> GetGruposConEventos(Usuario user)
        {
            ICollection<Grupo> grupos = Context.Set<Grupo>()
                .Include("GruposEvento.Evento")
                .Include("GrupoUsuarios.Usuario")
                .ToList();

            ICollection<Grupo> gruposDeUsuario = grupos.Where(g => g.Integrantes.Any(i => i.Id == user.Id)).ToList();
            return gruposDeUsuario;
        }

        public Grupo GetWithEventosAndUsers(Guid grupoId)
        {
            return Context.Set<Grupo>()
                .Where(g => g.Id == grupoId)
                .Include("GruposEvento.Evento")
                .Include("GrupoUsuarios.Usuario.Eventos")
                .FirstOrDefault();
        }
        public IEnumerable<Grupo> GetAllWithIntegrantes()
        {
            return Context.Set<Grupo>().Include("GrupoUsuarios.Usuario");
        }

        public Grupo GetWithIntegrantes(params object[] keyValues)
        {
            var grupo = Context.Set<Grupo>().Find(keyValues);
            return Context.Set<Grupo>().Where(g => g.Id == grupo.Id).Include("GrupoUsuarios.Usuario").Include(g => g.Administrador).FirstOrDefault();
        }

        public IEnumerable<Grupo> GetGroupsOfUserWithSeguimientos(Usuario user)
        {
            ICollection<Grupo> grupos = Context.Set<Grupo>().Include("GrupoSeguimiento.SeguimientoVirtual.Usuario").Include("GrupoUsuarios.Usuario").ToList();
            return grupos.Where(g => g.Integrantes.Any(u => u.Id == user.Id)).ToList();
        }

        public Grupo GetWithAdmin(Guid grupoId)
        {
            return Context.Set<Grupo>().Include(g => g.Administrador).Where(g => g.Id == grupoId).FirstOrDefault();
        }

        public Grupo GetWithSeguimientoAndUsers(Guid grupoId)
        {
            return Context.Set<Grupo>().Where(g => g.Id == grupoId).Include("GrupoUsuarios.Usuario").Include("GrupoSeguimiento.SeguimientoVirtual.Usuario").FirstOrDefault();
        }
    }
}
