using AutoMapper;
using Dominio.Grupos;
using Dominio.Usuarios;
using LogicaNegocio.Grupos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Mapper
{
    public class GrupoProfile : Profile
    {
        public GrupoProfile()
        {
            CreateMap<Grupo, GrupoDto>()
                .ForMember(dest => dest.GrupoId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.HistorialMensajes, opt => opt.MapFrom(src => src.HistorialMensajes.OrderByDescending(x => x.NroMensaje)))
                .ForMember(dest => dest.GrupoNombre, opt => opt.MapFrom(src => src.Nombre));
            CreateMap<Usuario, IntegranteDto>();

        }
    }
}
