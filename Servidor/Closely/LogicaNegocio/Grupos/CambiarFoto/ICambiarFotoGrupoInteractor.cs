using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Grupos.CambiarFoto
{
    public interface ICambiarFotoGrupoInteractor
    {
        Task<GrupoDto> CambiarFoto(CambiarFotoGrupoInput input, string adminId);
    }
}
