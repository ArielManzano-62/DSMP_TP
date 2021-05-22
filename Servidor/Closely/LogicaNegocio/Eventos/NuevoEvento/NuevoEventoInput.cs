using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.NuevoEvento
{
    public class NuevoEventoInput
    {
        public string UsuarioId { get; set; }
        public string TipoEvento { get; set; }
    }
}
