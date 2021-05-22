using LogicaNegocio.Repositorio;
using LogicaNegocio.Repositorio.Aggregates;
using Respositorio.Aggregates;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        public IEventoRepositorio Eventos { get; set; }
        public IGrupoRepositorio Grupos { get; set; }
        public IUsuarioRepositorio Usuarios { get; set; }
        public ISuscripcionRepositorio Suscripciones { get; set; }
        public ISeguimientoRepositorio Seguimientos { get; set; }

        public UnitOfWork(DataContext context)
        {
            _context = context;
            Eventos = new EventoRepositorio(context);
            Grupos = new GrupoRepositorio(context);
            Usuarios = new UsuarioRepositorio(context);
            Suscripciones = new SuscripcionRepositorio(context);
            Seguimientos = new SeguimientoRepositorio(context);
        }

        public void Complete() { _context.SaveChanges(); }

        public void Dispose() { _context.Dispose(); }
    }
}
