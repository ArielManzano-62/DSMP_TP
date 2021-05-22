using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio
{
    public interface IImageUploader
    {
        Task<string> SubirImagen(IFormFile file);
    }
}
