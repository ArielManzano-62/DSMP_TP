using AutoMapper;
using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Grupos.ObtenerGrupos
{
    public class ObtenerGruposInteractor : IObtenerGruposInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ObtenerGruposInteractor(IUnitOfWork repo, IMapper mapper)
        {
            _repositorio = repo;
            _mapper = mapper;
        }

        public IEnumerable<GrupoDto> Obtener(string integranteId)
        {
            IEnumerable<Grupo> grupos = new List<Grupo>();
            if (integranteId == null || integranteId == "") throw new ArgumentException($"El id del integrante no puede ser null");
            Usuario integrante = _repositorio.Usuarios.Get(integranteId);
            if (integrante == null) throw new ArgumentException($"No existe integrante con Id {integranteId}");
            grupos = _repositorio.Grupos.GetAllWithIntegrantes();
            ICollection<GrupoDto> gruposDeIntegrante = new List<GrupoDto>();

            foreach (Grupo g in grupos)
            {
                if (g.Integrantes.Contains(integrante))
                {                    
                    gruposDeIntegrante.Add(_mapper.Map<GrupoDto>(g));
                }
            }

            return gruposDeIntegrante;
        }
    }
}
