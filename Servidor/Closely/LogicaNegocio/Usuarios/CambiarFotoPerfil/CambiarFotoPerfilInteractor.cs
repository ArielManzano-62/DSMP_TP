using LogicaNegocio.Repositorio;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.CambiarFotoPerfil
{
    public class CambiarFotoPerfilInteractor : ICambiarFotoPerfilInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly IImageUploader _imageUploader;
        private readonly IIdentityProvider _identityProvider;

        public CambiarFotoPerfilInteractor(IUnitOfWork repo,
            IImageUploader imageUploader,
            IIdentityProvider identityProvider)
        {
            _repositorio = repo;
            _imageUploader = imageUploader;
            _identityProvider = identityProvider;
        }

        public async Task<string> SubirFotoPerfil(string userId, IFormFile file)
        {
            try
            {
                var user = _repositorio.Usuarios.Get(userId);
                if (user == null) throw new ArgumentException("No existe dicho user con dicho id");

                var path = await _imageUploader.SubirImagen(file);

                user.FotoUrl = path;

                await _identityProvider.UpdateUser(userId, "", "", user.FotoUrl);

                _repositorio.Usuarios.Update(user);
                _repositorio.Complete();

                return path;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return "";
            }
        }
    }
}
