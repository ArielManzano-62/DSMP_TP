using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Estadisticas.MapaCalor
{
    public interface IObtenerPuntosDeEventosInteractor
    {
        IEnumerable<PuntosDto> ObtenerPuntos(RangoFechasRequest input);
    }
}
