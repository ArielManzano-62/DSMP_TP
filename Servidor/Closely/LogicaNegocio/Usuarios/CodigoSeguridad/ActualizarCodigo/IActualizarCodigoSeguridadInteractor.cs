using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.CodigoSeguridad.ActualizarCodigo
{
    public interface IActualizarCodigoSeguridadInteractor
    {
        void Actualizar(ActualizarCodigoInput input, string userId);
    }
}
