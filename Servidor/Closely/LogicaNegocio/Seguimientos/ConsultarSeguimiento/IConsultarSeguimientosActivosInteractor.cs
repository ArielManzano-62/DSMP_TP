using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Seguimientos.ConsultarSeguimiento
{
    public interface IConsultarSeguimientosActivosInteractor
    {
        IEnumerable<SeguimientoVirtualDto> Consultar(string userId);
    }
}
