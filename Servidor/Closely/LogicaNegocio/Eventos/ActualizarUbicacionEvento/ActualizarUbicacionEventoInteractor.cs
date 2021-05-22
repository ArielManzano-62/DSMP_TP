using Dominio.Eventos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ActualizarUbicacionEvento
{
    public class ActualizarUbicacionEventoInteractor : IActualizarUbicacionEventoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ActualizarUbicacionEventoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public void ActualizarUbicacion(Guid eventoId, double latitude, double longitude)
        {
            Evento evento = _repositorio.Eventos.Get(eventoId);
            if (evento == null) throw new NullReferenceException("No existe evento con ese Id");
            try
            {
                evento.ActualizarUbicacion(latitude, longitude);

                _repositorio.Eventos.Update(evento);
                _repositorio.Complete();
                _repositorio.Dispose();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
