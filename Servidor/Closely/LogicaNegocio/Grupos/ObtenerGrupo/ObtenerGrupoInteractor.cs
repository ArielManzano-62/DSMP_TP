using AutoMapper;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Grupos.ObtenerGrupo
{
    public class ObtenerGrupoInteractor : IObtenerGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ObtenerGrupoInteractor(IUnitOfWork repo, IMapper mapper)
        {
            _repositorio = repo;
            _mapper = mapper;
        }

        public GrupoDto Obtener(Guid grupoId)
        {
            if (grupoId == null || grupoId == Guid.Empty) throw new ArgumentException("Grupo Id es null");
            var g = _repositorio.Grupos.GetWithIntegrantes(grupoId);
            return _mapper.Map<GrupoDto>(g);
        }
    }
}
