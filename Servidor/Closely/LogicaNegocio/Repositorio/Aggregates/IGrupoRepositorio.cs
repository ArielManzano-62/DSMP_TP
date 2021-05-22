using Dominio.Grupos;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Repositorio.Aggregates
{
    public interface IGrupoRepositorio : IRepositorio<Grupo>
    {
        ICollection<Grupo> GetGroupsOfMembersWithMembers(Usuario user);
        ICollection<Grupo> GetGruposConEventos(Usuario user);
        Grupo GetWithEventosAndUsers(Guid grupoId);
        IEnumerable<Grupo> GetAllWithIntegrantes();
        Grupo GetWithIntegrantes(params object[] keyValues);
        IEnumerable<Grupo> GetGroupsOfUserWithSeguimientos(Usuario user);
        Grupo GetWithAdmin(Guid grupoId);
        Grupo GetWithSeguimientoAndUsers(Guid grupoId);
    }
}
