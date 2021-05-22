using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Eventos.HistorialPropio
{
    public interface IObtenerHistorialEventosPropioInteractor
    {
        IEnumerable<EventoDto> GetHistorialEventos(string userId);
    }
}
