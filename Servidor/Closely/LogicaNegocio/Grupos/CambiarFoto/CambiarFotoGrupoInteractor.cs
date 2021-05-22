using AutoMapper;
using LogicaNegocio.Repositorio;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Grupos.CambiarFoto
{
    public class CambiarFotoGrupoInteractor : ICambiarFotoGrupoInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IImageUploader _imageUploader;
        private readonly IMapper _mapper;

        public CambiarFotoGrupoInteractor(IUnitOfWork repositorio, IImageUploader imageUploader, IMapper mapper)
        {
            _repositorio = repositorio;
            _imageUploader = imageUploader;
            _mapper = mapper;
        }

        public async Task<GrupoDto> CambiarFoto(CambiarFotoGrupoInput input, string adminId) 
        {
            var grupo = _repositorio.Grupos.GetWithIntegrantes(input.GrupoId);
            if (grupo.Administrador.Id != adminId) throw new InvalidOperationException("Solo el administrador del grupo puede cambiar la foto del grupo");

            var source = await _imageUploader.SubirImagen(input.File);
            grupo.FotoUrl = source;

            _repositorio.Grupos.Update(grupo);
            _repositorio.Complete();

            return _mapper.Map<GrupoDto>(grupo);
        }
    }
}
