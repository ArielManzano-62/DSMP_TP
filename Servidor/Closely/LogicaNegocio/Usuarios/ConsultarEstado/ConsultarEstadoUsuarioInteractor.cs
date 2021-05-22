using AutoMapper;
using LogicaNegocio.Repositorio;
using LogicaNegocio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarEstado
{
    public class ConsultarEstadoUsuarioInteractor : IConsultarEstadoUsuarioInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ConsultarEstadoUsuarioInteractor(IUnitOfWork repo, IMapper mapper)
        {
            _repositorio = repo;
            _mapper = mapper;
        }

        public ConsultarEstadoOutput ConsultarEstado(string usuarioId)
        {
            if (usuarioId == null) return null;

            var user = _repositorio.Usuarios.GetWithEventoYSeguimiento(usuarioId);
            if (user == null) return null;
            if (user.EstaTranquilo()) return new ConsultarEstadoOutput { UsuarioEstado = user.Estado.ToString() };
            if (user.EstaEnSeguimiento())
            {
                return new ConsultarEstadoOutput
                {
                    UsuarioEstado = user.Estado.ToString(),
                    Evento = _mapper.Map<SeguimientoVirtualDto>(user.SeguimientoActual)
                };
            }

            return new ConsultarEstadoOutput
            {
                UsuarioEstado = user.Estado.GetType().ToString().Split('.').Last(),
                Evento = new ConsultarEstadoOutput.ConsultarEstadoEventoDto
                {
                    ApellidoUsuario = user.Apellido,
                    NombreUsuario = user.Nombre,
                    Estado = user.EventoActual.Estado.ToString(),
                    EventoId = user.EventoActual.Id,
                    FechaHoraInicio = user.EventoActual.FechaHoraInicio,
                    FechaHoraFin = user.EventoActual.FechaHoraFin,
                    TipoEvento = user.EventoActual.ToString(),
                    Mensajes = user.EventoActual.Mensajes.OrderByDescending(m => m.NroMensaje).ToList(),
                    Ubicaciones = user.EventoActual.Ubicaciones,
                    
                }
            };

        }
    }
}
