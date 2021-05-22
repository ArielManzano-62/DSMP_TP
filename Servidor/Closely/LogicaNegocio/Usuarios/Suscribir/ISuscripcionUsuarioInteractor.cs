using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.Suscribir
{
    public interface ISuscripcionUsuarioInteractor
    {
        SuscripcionOutput Subscribir(string userId);
    }
}
