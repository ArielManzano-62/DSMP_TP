using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.CodigoSeguridad.ActualizarCodigo
{
    public class ActualizarCodigoSeguridadInteractor : IActualizarCodigoSeguridadInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ActualizarCodigoSeguridadInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public void Actualizar(ActualizarCodigoInput input, string userId)
        {
            if (input.CodigoNuevo == null || input.CodigoNuevo == "") throw new ArgumentException("El codigo nuevo fue null");

            var user = _repositorio.Usuarios.Get(userId);
            if (user == null) throw new ArgumentException($"No existe usuario con id {userId}");

            user.ActualizarCodigo(input.CodigoAntiguo, input.CodigoNuevo);
            _repositorio.Usuarios.Update(user);
            _repositorio.Complete();
        }
    }
}
