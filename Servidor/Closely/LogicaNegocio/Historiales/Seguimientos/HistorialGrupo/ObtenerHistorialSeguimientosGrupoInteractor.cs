using AutoMapper;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Seguimientos.HistorialGrupo
{
    public class ObtenerHistorialSeguimientosGrupoInteractor : IObtenerHistorialSeguimientosGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ObtenerHistorialSeguimientosGrupoInteractor(
            IUnitOfWork repositorio,
            IMapper mapper)
        {
            _repositorio = repositorio;
            _mapper = mapper;
        }

        public IEnumerable<SeguimientoVirtualDto> Obtener(string userId, Guid grupoId)
        {
            if (grupoId == null || grupoId == Guid.Empty) throw new ArgumentException("No proporciono GrupoId");
            var grupo = _repositorio.Grupos.GetWithSeguimientoAndUsers(grupoId);
            if (grupo == null) throw new ArgumentException("No existe grupo con ese Id");

            var user = _repositorio.Usuarios.Get(userId);
            if (!grupo.Integrantes.Contains(user)) throw new UnauthorizedAccessException("Usuario no pertenece al grupo");

            return _mapper.Map<IEnumerable<SeguimientoVirtualDto>>(grupo.Seguimientos);
        }
    }
}
