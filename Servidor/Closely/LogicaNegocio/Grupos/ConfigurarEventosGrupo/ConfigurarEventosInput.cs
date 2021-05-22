using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.ConfigurarEventosGrupo
{
    public class ConfigurarEventosInput
    {
        public Guid GrupoId { get; set; }
        public bool Asalto { get; set; }
        public bool Incendio { get; set; }
        public bool EmergenciaMedica { get; set; }
    }
}
