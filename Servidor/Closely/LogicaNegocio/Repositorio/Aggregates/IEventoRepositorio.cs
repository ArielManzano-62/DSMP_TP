using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Repositorio.Aggregates
{
    public interface IEventoRepositorio : IRepositorio<Evento>
    {
        IEnumerable<Evento> ObtenerEnRango(DateTime desde, DateTime hasta);
    }
}
