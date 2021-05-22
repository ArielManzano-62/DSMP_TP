using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.AprobarSuscripcion
{
    public interface IAprobarSuscripcionInteractor
    {
        bool Aprobar(AprobarSuscripcionInput input);
    }
}
