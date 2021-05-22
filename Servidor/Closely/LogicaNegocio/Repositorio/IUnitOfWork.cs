using LogicaNegocio.Repositorio.Aggregates;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Repositorio
{
    public interface IUnitOfWork : IDisposable
    {
        IEventoRepositorio Eventos { get; set; }
        IGrupoRepositorio Grupos { get; set; }
        IUsuarioRepositorio Usuarios { get; set; }
        ISuscripcionRepositorio Suscripciones { get; set; }
        ISeguimientoRepositorio Seguimientos { get; set; }

        void Complete();
    }
}
