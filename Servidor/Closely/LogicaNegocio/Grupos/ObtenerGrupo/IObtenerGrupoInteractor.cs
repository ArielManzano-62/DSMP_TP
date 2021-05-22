using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.ObtenerGrupo
{
    public interface IObtenerGrupoInteractor
    {
        GrupoDto Obtener(Guid grupoId);
    }
}
