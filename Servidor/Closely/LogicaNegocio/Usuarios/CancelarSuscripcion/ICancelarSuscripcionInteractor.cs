using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.CancelarSuscripcion
{
    public interface ICancelarSuscripcionInteractor
    {
        Task Cancelar(string userId, string motivo);
    }
}
