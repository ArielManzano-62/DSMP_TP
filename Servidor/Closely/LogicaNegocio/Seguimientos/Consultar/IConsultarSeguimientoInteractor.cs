using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Seguimientos.Consultar
{
    public interface IConsultarSeguimientoInteractor
    {
        SeguimientoVirtualDto Consultar(Guid seguimientoId);
    }
}
