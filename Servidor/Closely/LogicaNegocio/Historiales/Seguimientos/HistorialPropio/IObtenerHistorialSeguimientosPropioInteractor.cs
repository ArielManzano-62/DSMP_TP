using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Seguimientos.HistorialPropio
{
    public interface IObtenerHistorialSeguimientosPropioInteractor
    {
        IEnumerable<SeguimientoVirtualDto> Obtener(string userId);
    }
}
