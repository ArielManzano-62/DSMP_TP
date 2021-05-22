using AutoMapper;
using Dominio.Grupos;
using Dominio.Seguimientos;
using Dominio.Usuarios;
using LogicaNegocio.Historiales.Seguimientos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static LogicaNegocio.Historiales.Seguimientos.SeguimientoVirtualDto;

namespace LogicaNegocio.Mapper
{
    public class HistorialSeguimientoProfile : Profile
    {
        public HistorialSeguimientoProfile()
        {
            CreateMap<SeguimientoVirtual, SeguimientoVirtualDto>()
                .ForMember(dest => dest.Ubicaciones, opt => opt.MapFrom(src => src.Ubicaciones.OrderByDescending(u => u.FechaHora)))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado.ToString()));
            CreateMap<Usuario, UsuarioDto>();
            CreateMap<Grupo, GrupoDto>();
        }
    }
}
