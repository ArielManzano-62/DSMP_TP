using LogicaNegocio.Eventos.ConsultarEvento;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ConsultarEventosActivos
{
    public interface IConsultarEventosActivosInteractor
    {
        ICollection<EventoDto> ConsultarEventosActivos(string userId);
    }
}
