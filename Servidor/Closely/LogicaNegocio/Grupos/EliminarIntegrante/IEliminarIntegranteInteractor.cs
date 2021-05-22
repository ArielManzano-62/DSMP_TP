using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.EliminarIntegrante
{
    public interface IEliminarIntegranteInteractor
    {
        GrupoDto EliminarIntegrante(EliminarIntegranteInput input, string adminId);
    }
}
