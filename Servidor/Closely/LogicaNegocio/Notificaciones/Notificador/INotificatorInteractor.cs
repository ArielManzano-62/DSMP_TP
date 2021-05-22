using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Notificaciones.Notificador
{
    public interface INotificatorInteractor
    {
        Task EnviarNotificacion(string[] userIds, Message msg);
    }
}
