using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.ConfigurarEventosGrupo
{
    public interface IConfigurarEventosGrupoInteractor
    {
        void ConfigurarEventos(string userId, ConfigurarEventosInput input);
    }
}
