using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Notificaciones.DesuscribirFcmKey
{
    public interface IDesuscribirFcmKeyInteractor
    {
        void Unregister(string usuarioId, string token);
    }
}
