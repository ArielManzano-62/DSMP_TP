using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.ObtenerGrupos
{
    public interface IObtenerGruposInteractor
    {
        IEnumerable<GrupoDto> Obtener(string integranteId);
    }
}
