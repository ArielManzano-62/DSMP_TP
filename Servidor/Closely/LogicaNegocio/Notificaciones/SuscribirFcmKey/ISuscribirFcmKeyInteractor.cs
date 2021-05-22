using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Notificaciones.SuscribirFcmKey
{
    public interface ISuscribirFcmKeyInteractor
    {
        SuscribirFcmKeyOutput RegisterKey(SuscribirFcmKeyInput input);
    }
}
