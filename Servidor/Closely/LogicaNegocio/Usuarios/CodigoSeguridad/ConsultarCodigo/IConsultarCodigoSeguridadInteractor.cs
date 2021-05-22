using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.CodigoSeguridad.ConsultarCodigo
{
    public interface IConsultarCodigoSeguridadInteractor
    {
        bool Consultar(string userId);
    }
}
