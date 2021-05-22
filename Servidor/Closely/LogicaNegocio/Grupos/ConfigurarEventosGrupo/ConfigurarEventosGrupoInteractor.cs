using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.ConfigurarEventosGrupo
{
    public class ConfigurarEventosGrupoInteractor : IConfigurarEventosGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ConfigurarEventosGrupoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public void ConfigurarEventos(string userId, ConfigurarEventosInput input)
        {
            if (userId == null || userId == "") throw new ArgumentException("Usuario Id null");

            var user = _repositorio.Usuarios.GetUsuarioConEstadoYGrupos(userId);
            if (user == null) throw new ArgumentException("Ese usuario no existe");

            var grupo = _repositorio.Grupos.GetWithEventosAndUsers(input.GrupoId);
            if (grupo == null) throw new ArgumentException("Ese grupo no existe");

            if (!user.Grupos.Contains(grupo)) throw new UnauthorizedAccessException("El usuario no pertenece al grupo!");

            grupo.ConfigurarParaUsuario(user, input.Asalto, input.EmergenciaMedica, input.Incendio);

            _repositorio.Grupos.Update(grupo);
            _repositorio.Complete();
        }
    }
}
