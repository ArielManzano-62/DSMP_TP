using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Grupos.CrearGrupo
{
    public interface ICrearGrupoInteractor
    {
        Task<GrupoDto> CrearGrupo(CrearGrupoInput input, string adminId);
    }
}
