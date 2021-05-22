using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.Crear
{
    public class CrearUsuarioInteractor : ICrearUsuarioInteractor
    {
        private readonly IIdentityProvider _identityProvider;

        public CrearUsuarioInteractor(IIdentityProvider idProvider)
        {
            _identityProvider = idProvider;
        }

        public void Crear(CrearUsuarioInput input)
        {
            if (input.Email == null || input.Email == "") throw new ArgumentNullException("El Email fue null");
            if (input.Nombre == null || input.Nombre == "") throw new ArgumentNullException("El Nombre fue null");
            if (input.Apellido == null || input.Apellido == "") throw new ArgumentNullException("El Apellido fue null");
            if (input.Password == null || input.Password == "") throw new ArgumentNullException("La Password fue null");
            try
            {
                _identityProvider.CreateUser(input.Email, input.Password, input.Nombre, input.Apellido);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

        }

        public async Task<bool> VerificarEmailExistente(string email)
        {
            var resp = await _identityProvider.UserExistByEmail(email);
            return resp;
        }
    }
}
