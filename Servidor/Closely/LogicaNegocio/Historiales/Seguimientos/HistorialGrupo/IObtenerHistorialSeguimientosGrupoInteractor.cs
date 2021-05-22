using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Seguimientos.HistorialGrupo
{
    public interface IObtenerHistorialSeguimientosGrupoInteractor
    {
        IEnumerable<SeguimientoVirtualDto> Obtener(string userId, Guid grupoId);
    }
}
