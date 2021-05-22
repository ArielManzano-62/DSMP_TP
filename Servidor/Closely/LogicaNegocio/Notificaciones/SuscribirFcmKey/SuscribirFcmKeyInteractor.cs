using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Notificaciones.SuscribirFcmKey
{
    public class SuscribirFcmKeyInteractor : ISuscribirFcmKeyInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public SuscribirFcmKeyInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public SuscribirFcmKeyOutput RegisterKey(SuscribirFcmKeyInput input)
        {
            Usuario user = _repositorio.Usuarios.Get(input.UsuarioId);
            if (user != null)
            {
                foreach (FcmKey llave in user.Keys)
                {
                    if (llave.Key.Equals(input.FcmKey))
                    {
                        return new SuscribirFcmKeyOutput
                        {
                            ApiKey = llave.Key,
                            Result = "Key Already Registered"
                        };
                    }
                        
                }

                FcmKey key = new FcmKey(input.FcmKey);
                user.Keys.Add(key);
                _repositorio.Usuarios.Update(user);
                _repositorio.Complete();

                return new SuscribirFcmKeyOutput
                {
                    ApiKey = input.FcmKey,
                    Result = "Success"
                };
            }
            return new SuscribirFcmKeyOutput
            {
                ApiKey = input.FcmKey,
                Result = "Fail"
            };
        }
    }
}
