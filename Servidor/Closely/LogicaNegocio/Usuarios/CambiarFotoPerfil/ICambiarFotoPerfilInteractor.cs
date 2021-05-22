using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.CambiarFotoPerfil
{
    public interface ICambiarFotoPerfilInteractor
    {
        Task<string> SubirFotoPerfil(string userId, IFormFile file);
    }
}
