using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarEstado
{
    public interface IConsultarEstadoUsuarioInteractor
    {
        ConsultarEstadoOutput ConsultarEstado(string usuarioId);
    }
}
