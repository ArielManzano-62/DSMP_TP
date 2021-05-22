using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ModificarDatos
{
    //TODO: MODIFCAR 100%, esto se llamaba desde el rabbitMQ
    public class ModificarDatosUsuarioInteractor : IModificarDatosUsuarioInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IIdentityProvider _identityProvider;

        public ModificarDatosUsuarioInteractor(IUnitOfWork repo, IIdentityProvider identityProvider)
        {
            _repositorio = repo;
            _identityProvider = identityProvider;
        }

        public bool ModificarDatos(string userId, ModificarDatosUsuarioInput input)
        {
            try
            {
                if (userId == null || userId == "") throw new ArgumentException("Id null");
                var user = _repositorio.Usuarios.Get(userId);
                if (user == null) throw new ArgumentException("No existe ese usuario");

                _identityProvider.UpdateUser(userId, input.Nombre, input.Apellido, "");

                if (input.Nombre != "" && input.Nombre != null)
                    user.Nombre = input.Nombre;
                if (input.Apellido != "" && input.Apellido != null)
                    user.Apellido = input.Apellido;

                _repositorio.Usuarios.Update(user);
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
