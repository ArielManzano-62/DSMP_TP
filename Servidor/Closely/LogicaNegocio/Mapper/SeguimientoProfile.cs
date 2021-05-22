using AutoMapper;
using Dominio.Seguimientos;
using Dominio.Usuarios;
using LogicaNegocio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static LogicaNegocio.Seguimientos.SeguimientoVirtualDto;

namespace LogicaNegocio.Mapper
{
    public class SeguimientoProfile : Profile
    {
        public SeguimientoProfile()
        {
            CreateMap<SeguimientoVirtual, SeguimientoVirtualDto>()
                .ForMember(dest => dest.Ubicaciones, opt => opt.MapFrom(src => src.Ubicaciones.OrderByDescending(u => u.FechaHora)))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado.ToString()));
            CreateMap<Usuario, UsuarioDto>();
        }
    }
}
