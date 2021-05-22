using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.Crear
{
    public interface ICrearUsuarioInteractor
    {
        void Crear(CrearUsuarioInput input);
        Task<bool> VerificarEmailExistente(string email);
    }
}
