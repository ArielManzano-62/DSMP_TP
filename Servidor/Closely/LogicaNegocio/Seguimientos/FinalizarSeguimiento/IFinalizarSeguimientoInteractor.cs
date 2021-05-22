using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Seguimientos.FinalizarSeguimiento
{
    public interface IFinalizarSeguimientoInteractor
    {
        bool Finalizar(string userId, FinalizarSeguimientoInput input);
    }
}
