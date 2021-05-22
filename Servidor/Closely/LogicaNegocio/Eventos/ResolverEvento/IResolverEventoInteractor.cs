using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ResolverEvento
{
    public interface IResolverEventoInteractor
    {
        ResolverEventoOutput ResolverEvento(string usuarioId, ResolverEventoInput input);
    }
}
