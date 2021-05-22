using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.AbandonarGrupo
{
    public interface IAbandonarGrupoInteractor
    {
        bool Abandonar(AbandonarGrupoInput input);
    }
}
