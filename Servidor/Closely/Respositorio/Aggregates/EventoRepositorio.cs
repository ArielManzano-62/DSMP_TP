using Dominio.Eventos;
using Dominio.Eventos.Estados;
using LogicaNegocio.Repositorio.Aggregates;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Respositorio.Aggregates
{
    public class EventoRepositorio : Repositorio<Evento>, IEventoRepositorio 
    {
        public EventoRepositorio(DbContext context) : base(context)
        {

        }

        public IEnumerable<Evento> ObtenerEnRango(DateTime desde, DateTime hasta)
        {
            return Context.Set<Evento>().Where(e => e.FechaHoraInicio >= desde && e.FechaHoraFin <= hasta).ToList();
        }
    }
}
