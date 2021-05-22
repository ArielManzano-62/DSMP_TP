using Dominio.Grupos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.AbandonarGrupo
{
    public class AbandonarGrupoInteractor : IAbandonarGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public AbandonarGrupoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public bool Abandonar(AbandonarGrupoInput input)
        {
            var grupo = _repositorio.Grupos.GetWithIntegrantes(input.GrupoId);
            if (grupo == null) throw new ArgumentException($"No existe grupo con Id {input.GrupoId}");
            var integrante = _repositorio.Usuarios.Get(input.UsuarioId);
            if (integrante == null) throw new ArgumentException($"No existe usuario con Id {input.UsuarioId}");

            try
            {
                grupo.Abandonar(integrante);

                _repositorio.Grupos.Update(grupo);
                _repositorio.Complete();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }
    }
}
