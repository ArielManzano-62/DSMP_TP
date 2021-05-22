using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.Registrar
{
    public class RegistrarUsuarioInteractor : IRegistrarUsuarioInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public RegistrarUsuarioInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public void RegistrarUsuario(RegistrarUsuarioInput input)
        {
            if (input.UserId == null || input.UserId == "") throw new ArgumentNullException("El Id fue null");
            if (input.Nombre == null || input.Nombre == "") throw new ArgumentNullException("El Nombre fue null");
            if (input.Apellido == null || input.Apellido == "") throw new ArgumentNullException("El Apellido fue null");
            if (input.FotoUrl == null || input.FotoUrl == "") throw new ArgumentNullException("La foto fue null");
            if (input.Email == null || input.Email == "") throw new ArgumentNullException("El Email fue null");

            
            Usuario user = _repositorio.Usuarios.Get(input.UserId);
            if (user != null) throw new ArgumentException("Ya existe usuario con id {0}", user.Id);

            Usuario nuevoUsuario = new Usuario(input.UserId, input.Nombre, input.Apellido, input.Email, input.FotoUrl);
            _repositorio.Usuarios.Add(nuevoUsuario);
            _repositorio.Complete();
            
        }
    }
}
