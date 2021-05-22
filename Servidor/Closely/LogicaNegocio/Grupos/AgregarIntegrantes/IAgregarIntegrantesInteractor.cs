using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.AgregarIntegrantes
{
    public interface IAgregarIntegrantesInteractor
    {
        GrupoDto AgregarIntegrantes(AgregarIntegrantesInput input, string adminId);
    }
}
