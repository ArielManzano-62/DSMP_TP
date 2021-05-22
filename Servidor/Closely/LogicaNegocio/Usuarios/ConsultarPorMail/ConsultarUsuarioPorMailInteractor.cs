using AutoMapper;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarPorMail
{
    public class ConsultarUsuarioPorMailInteractor : IConsultarUsuarioPorMailInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IMapper _mapper;

        public ConsultarUsuarioPorMailInteractor(IUnitOfWork repo, IMapper mapper)
        {
            _repositorio = repo;
            _mapper = mapper;
        }

        public UsuarioDto Consultar(string email)
        {
            var integrante = _repositorio.Usuarios.GetByEmail(email);
            if (!(integrante == null)) return _mapper.Map<UsuarioDto>(integrante);
            throw new ArgumentException($"No existe usuario con email '{email}'");
        }
    }
}
