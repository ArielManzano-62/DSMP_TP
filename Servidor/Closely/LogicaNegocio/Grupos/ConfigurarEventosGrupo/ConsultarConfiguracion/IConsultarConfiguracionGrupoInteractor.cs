using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.ConfigurarEventosGrupo.ConsultarConfiguracion
{
    public interface IConsultarConfiguracionGrupoInteractor
    {
        ConfiguracionOutput ObtenerConfiguracion(string userId, Guid grupoId);
    }
}
