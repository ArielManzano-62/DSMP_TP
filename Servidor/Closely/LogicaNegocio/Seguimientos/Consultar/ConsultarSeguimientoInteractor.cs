using AutoMapper;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Seguimientos.Consultar
{
    public class ConsultarSeguimientoInteractor : IConsultarSeguimientoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ConsultarSeguimientoInteractor(
            IUnitOfWork repositorio,
            IMapper mapper)
        {
            _repositorio = repositorio;
            _mapper = mapper;
        }

        public SeguimientoVirtualDto Consultar(Guid seguimientoId) 
        {
            var seguimiento = _repositorio.Seguimientos.GetWithUser(seguimientoId);
            if (seguimiento == null) throw new ArgumentException("El id del seguimiento id no es valido");

            return _mapper.Map<SeguimientoVirtualDto>(seguimiento);

        }
    }
}
