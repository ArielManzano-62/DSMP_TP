using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Notificaciones.Notificador
{
    public class NotificatorInteractor : INotificatorInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public NotificatorInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public async Task EnviarNotificacion(string[] userIds, Message msg)
        {
            ICollection<string> keys = new List<string>();
            foreach (string id in userIds)
            {
                var user = _repositorio.Usuarios.Get(id);
                if (user != null && user.Keys.Count > 0)
                {
                    foreach (FcmKey key in user.Keys)
                    {
                        if (keys.Contains(key.Key)) continue;
                        keys.Add(key.Key);
                    }
                        
                }
            }

            string[] array = new string[keys.Count];
            keys.CopyTo(array, 0);
            msg.registration_ids = array;
            await FcmInterface.SendPushNotification(msg);
        }
    }
}
