using System;
using System.Collections.Generic;
using System.Text;
using static Dominio.Eventos.Evento;

namespace Dominio.Grupos
{
    public class ConfiguracionGrupo
    {
        public string UsuarioId { get; private set; }
        public ICollection<ConfiguracionEvento> ConfiguracionesEvento { get; private set; }

        public ConfiguracionGrupo() { }

        public ConfiguracionGrupo(string userId)
        {
            UsuarioId = userId;
            ConfiguracionesEvento = new List<ConfiguracionEvento>
            {
                new ConfiguracionEvento(TipoEvento.ASALTO),
                new ConfiguracionEvento(TipoEvento.EMERGENCIAMEDICA),
                new ConfiguracionEvento(TipoEvento.INCENDIO)
            };
        }

        public ConfiguracionGrupo(string userId, bool asalto, bool emergenciaMedica, bool incendio)
        {
            UsuarioId = userId;
            ConfiguracionesEvento = new List<ConfiguracionEvento>
            {
                new ConfiguracionEvento(TipoEvento.ASALTO, asalto),
                new ConfiguracionEvento(TipoEvento.EMERGENCIAMEDICA, emergenciaMedica),
                new ConfiguracionEvento(TipoEvento.INCENDIO, incendio)
            };
        }
    }
}
