using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Seguimientos.NuevoSeguimiento
{
    public interface INuevoSeguimientoInteractor
    {
        SeguimientoVirtualDto NuevoSeguimiento(string userId, NuevoSeguimientoInput input);
    }
}
