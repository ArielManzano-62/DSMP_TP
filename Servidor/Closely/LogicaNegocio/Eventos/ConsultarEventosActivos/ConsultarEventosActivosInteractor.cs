using Dominio.Eventos;
using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Eventos.ConsultarEvento;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Eventos.ConsultarEventosActivos
{
    public class ConsultarEventosActivosInteractor : IConsultarEventosActivosInteractor
    {
        private readonly IUnitOfWork _repositorio;
        public ConsultarEventosActivosInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public ICollection<EventoDto> ConsultarEventosActivos(string usuarioId)
        {
            var usuario = _repositorio.Usuarios.GetUsuarioConEventoYGrupos(usuarioId);
            if (!usuario.EstaTranquilo()) throw new InvalidOperationException("No se pueden consultar eventos estando en una emergencia");

            ICollection<Grupo> grupos = _repositorio.Grupos.GetGruposConEventos(usuario);

            ICollection<EventoDto> eventos = new List<EventoDto>();
            if (grupos.Count == 0) throw new Exception("No tiene grupos");
            foreach (Grupo g in grupos)
            {
                if (g.Eventos.Count == 0) continue;
                foreach (Evento e in g.Eventos)
                {
                    if (e.EnTranscurso())
                    {
                        if (eventos.Any(eve => eve.Id == e.Id)) continue;
                        Usuario u = _repositorio.Usuarios.GetUsuarioByEventoActual(e);
                        if (u.Id == usuario.Id) continue;
                        EventoDto ev = new EventoDto
                        {
                            Id = e.Id,
                            Afectado = new
                            {
                                Id = u.Id,
                                Nombre = u.Nombre + " " + u.Apellido,
                                Foto = u.FotoUrl
                            },
                            TipoEvento = e.ToString(),
                            FechaHora = e.FechaHoraInicio,
                            Ubicaciones = e.Ubicaciones,
                            Mensajes = e.Mensajes.OrderByDescending(m => m.NroMensaje).ToList()
                        };
                        eventos.Add(ev);
                    }
                }
            }
            return eventos.OrderByDescending(e => e.FechaHora).ToList();

        }
    }
}
