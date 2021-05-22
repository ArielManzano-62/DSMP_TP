using Dominio.Eventos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.NuevoMensaje
{
    public class NuevoMensajeEventoInteractor : INuevoMensajeEventoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public NuevoMensajeEventoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public RegistroMensaje Registrar(string contenido, string userId, Guid eventoId)
        {
            if (string.IsNullOrWhiteSpace(contenido)) throw new ArgumentNullException($"El contenido fue null");
            if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentNullException($"El usuario fue null");

            var user = _repositorio.Usuarios.Get(userId);
            if (user == null) throw new ArgumentException($"No existe usuario con id {userId}");

            var evento = _repositorio.Eventos.Get(eventoId);
            if (evento == null) throw new ArgumentException($"No existe evento con id {eventoId}");

            var nuevoMensaje = evento.NuevoMensaje(contenido, user);
            _repositorio.Eventos.Update(evento);
            _repositorio.Complete();

            return nuevoMensaje;


        }
    }
}
