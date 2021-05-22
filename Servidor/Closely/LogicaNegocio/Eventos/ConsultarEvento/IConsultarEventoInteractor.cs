using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ConsultarEvento
{
    public interface IConsultarEventoInteractor
    {
        EventoDto ConsultarEvento(Guid eventoId);
    }
}
