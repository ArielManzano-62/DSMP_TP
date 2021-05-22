using AutoMapper;
using Dominio.Usuarios;
using LogicaNegocio.Usuarios.ConsultarPorMail;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Mapper
{
    public class UsuarioProfile : Profile
    {
        public UsuarioProfile()
        {
            CreateMap<Usuario, UsuarioDto>();
        }
    }
}
