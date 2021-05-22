using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ModificarDatos
{
    public interface IModificarDatosUsuarioInteractor
    {
        bool ModificarDatos(string userId, ModificarDatosUsuarioInput input);
    }
}
