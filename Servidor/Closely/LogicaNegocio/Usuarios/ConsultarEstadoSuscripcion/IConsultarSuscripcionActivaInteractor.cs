using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarEstadoSuscripcion
{
    public interface IConsultarSuscripcionActivaInteractor
    {
        bool Consultar(string userId);
    }
}
