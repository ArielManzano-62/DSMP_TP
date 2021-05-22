using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.NuevoEvento
{
    public interface INuevoEventoInteractor
    {
        NuevoEventoOutput NuevoEvento(NuevoEventoInput input);
    }
}
