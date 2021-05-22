using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.CodigoSeguridad.ConsultarCodigo
{
    public class ConsultarCodigoSeguridadInteractor : IConsultarCodigoSeguridadInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ConsultarCodigoSeguridadInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public bool Consultar(string userId)
        {
            if (userId == null || userId == "") throw new ArgumentNullException("El id del usuario fue null");

            Usuario user = _repositorio.Usuarios.Get(userId);
            if (user == null) throw new ArgumentException($"No existe usuario con id {userId}");

            if (user.Codigo == null || user.Codigo == "")
                return false;
            return true;
        }
    }
}
