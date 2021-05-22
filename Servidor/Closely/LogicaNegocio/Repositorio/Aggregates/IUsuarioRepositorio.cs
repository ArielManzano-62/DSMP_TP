using Dominio.Eventos;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Repositorio.Aggregates
{
    public interface IUsuarioRepositorio : IRepositorio<Usuario>
    {
        Usuario GetUsuarioConEstadoYGrupos(string userId);
        Usuario GetUsuarioByEventoActual(Evento evento);
        Usuario GetUsuarioConEventoYGrupos(string userId);
        Usuario GetUsuarioConEvento(string userId);
        Usuario GetWithEventos(string userId);
        Usuario GetByEmail(string email);
        Usuario GetWithSuscripciones(string userId);
        Usuario GetWithEventoYSeguimiento(string userId);
        ICollection<Usuario> GetAllWithSuscripciones();
        ICollection<Usuario> GetAllWithEventos();
        Usuario GetWithSeguimientos(string userId);
    }
}
