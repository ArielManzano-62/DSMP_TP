using AutoMapper;
using LogicaNegocio.Repositorio;
using LogicaNegocio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Historiales.Seguimientos.HistorialPropio
{
    public class ObtenerHistorialSeguimientosPropioInteractor : IObtenerHistorialSeguimientosPropioInteractor
    {
        public IUnitOfWork _repositorio { get; set; }
        public IMapper _mapper { get; set; }

        public ObtenerHistorialSeguimientosPropioInteractor(
            IUnitOfWork repositorio,
            IMapper mapper)
        {
            _repositorio = repositorio;
            _mapper = mapper;
        }

        public IEnumerable<SeguimientoVirtualDto> Obtener(string userId)
        {
            var usuario = _repositorio.Usuarios.GetWithSeguimientos(userId);

            return _mapper.Map<IEnumerable<SeguimientoVirtualDto>>(usuario.Seguimientos);

        }
    }
}
