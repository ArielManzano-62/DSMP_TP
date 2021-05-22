using Dominio.Eventos;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Eventos.ResolverEvento
{
    public class ResolverEventoInteractor : IResolverEventoInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public ResolverEventoInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public ResolverEventoOutput ResolverEvento(string usuarioId, ResolverEventoInput input)
        {
            Usuario usuario = _repositorio.Usuarios.GetUsuarioConEvento(usuarioId);
            if (usuario == null) { throw new ArgumentNullException("El usuario no existe"); }
            try
            {
                Evento eventoResuelto = usuario.ResolverEvento(input.Descripcion, input.EstadoFinal);

                _repositorio.Usuarios.Update(usuario);
                _repositorio.Complete();

                var output = new ResolverEventoOutput
                {
                    EventoId = eventoResuelto.Id,
                    TipoEvento = eventoResuelto.ToString(),
                    NombreUsuario = usuario.Nombre,
                    ApellidoUsuario = usuario.Apellido,
                    FechaHoraInicio = eventoResuelto.FechaHoraInicio,
                    FechaHoraFin = eventoResuelto.FechaHoraFin,
                    Descripcion = eventoResuelto.Resolucion.Descripcion,
                    EstadoFinal = eventoResuelto.Resolucion.EstadoFinal.GetType().ToString().Split('.').Last()
                };

                return output;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }
    }
}
