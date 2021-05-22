using AutoMapper;
using Dominio.Grupos;
using Dominio.Seguimientos;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Seguimientos.ConsultarSeguimiento
{
    public class ConsultarSeguimientosActivosInteractor : IConsultarSeguimientosActivosInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ConsultarSeguimientosActivosInteractor(IUnitOfWork repositorio, IMapper mapper)
        {
            _repositorio = repositorio;
            _mapper = mapper;
        }

        public IEnumerable<SeguimientoVirtualDto> Consultar(string userId)
        {
            var user = _repositorio.Usuarios.Get(userId);
            var grupos = _repositorio.Grupos.GetGroupsOfUserWithSeguimientos(user);
            var seguimientosEnCurso = new List<SeguimientoVirtual>();

            foreach (Grupo g in grupos)
            {
                foreach (SeguimientoVirtual s in g.Seguimientos)
                {
                    if (!s.EstaEnTranscurso()) continue;
                    seguimientosEnCurso.Add(s);
                }
            }

            seguimientosEnCurso.Distinct();
            return _mapper.Map<ICollection<SeguimientoVirtualDto>>(seguimientosEnCurso);
        }
    }
}
