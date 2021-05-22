using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Eventos.HistorialGrupo
{
    public interface IObtenerHistorialEventosGrupoInteractor
    {
        IEnumerable<EventoDto> GetHisotrial(string userId, Guid grupoId);
    }
}
