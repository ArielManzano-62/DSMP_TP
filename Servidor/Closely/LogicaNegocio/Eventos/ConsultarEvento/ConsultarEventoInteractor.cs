using Dominio.Eventos;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Eventos.ConsultarEvento
{
    public class ConsultarEventoInteractor : IConsultarEventoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ConsultarEventoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public EventoDto ConsultarEvento(Guid eventoId)
        {
            Evento evento = _repositorio.Eventos.Get(eventoId);
            if (evento != null && evento.EnTranscurso())
            {
                Usuario user = _repositorio.Usuarios.GetUsuarioByEventoActual(evento);
                if (user != null)
                {
                    return new EventoDto
                    {
                        Id = evento.Id,
                        Afectado = new
                        {
                            Id = user.Id,
                            Nombre = user.Nombre + " " + user.Apellido,
                            Foto = user.FotoUrl
                        },
                        FechaHora = evento.FechaHoraInicio,
                        TipoEvento = evento.ToString(),
                        Ubicaciones = evento.Ubicaciones,
                        Mensajes = evento.Mensajes.OrderByDescending(m => m.NroMensaje).ToList()
                    };
                }
            }
            return null;
        }
    }
}
