using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static Dominio.Eventos.Evento;

namespace LogicaNegocio.Grupos.ConfigurarEventosGrupo.ConsultarConfiguracion
{
    public class ConsultarConfiguracionGrupoInteractor : IConsultarConfiguracionGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ConsultarConfiguracionGrupoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public ConfiguracionOutput ObtenerConfiguracion(string userId, Guid grupoId)
        {
            if (userId == null || grupoId == null || grupoId == Guid.Empty) throw new ArgumentException("Parametros mal");

            var grupo = _repositorio.Grupos.GetWithEventosAndUsers(grupoId);
            if (grupo == null) throw new ArgumentException("Ese grupo no existe");

            var user = _repositorio.Usuarios.Get(userId);

            if (!grupo.Integrantes.Contains(user)) throw new UnauthorizedAccessException("Ese usuario no pertenece al grupo");

            var config = grupo.Configuraciones.FirstOrDefault(c => c.UsuarioId == userId);
            var output = new ConfiguracionOutput();
            output.Asalto = config.ConfiguracionesEvento.First(ce => ce.TipoEvento == TipoEvento.ASALTO).Activado;
            output.EmergenciaMedica = config.ConfiguracionesEvento.First(ce => ce.TipoEvento == TipoEvento.EMERGENCIAMEDICA).Activado;
            output.Incendio = config.ConfiguracionesEvento.First(ce => ce.TipoEvento == TipoEvento.INCENDIO).Activado;

            return output;
        }
    }
}
