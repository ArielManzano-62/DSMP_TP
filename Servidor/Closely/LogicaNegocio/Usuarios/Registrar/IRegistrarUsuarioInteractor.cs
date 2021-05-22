using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.Registrar
{
    public interface IRegistrarUsuarioInteractor
    {
        void RegistrarUsuario(RegistrarUsuarioInput input);
    }
}
