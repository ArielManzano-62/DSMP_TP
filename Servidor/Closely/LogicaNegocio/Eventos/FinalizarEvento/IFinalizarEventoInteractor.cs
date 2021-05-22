using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.FinalizarEvento
{
    public interface IFinalizarEventoInteractor
    {
        FinalizarEventoOutput Finalizar(string usuarioId, string codigo);
    }
}
