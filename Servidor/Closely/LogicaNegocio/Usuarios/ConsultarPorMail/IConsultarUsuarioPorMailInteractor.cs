using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarPorMail
{
    public interface IConsultarUsuarioPorMailInteractor
    {
        UsuarioDto Consultar(string email);
    }
}
