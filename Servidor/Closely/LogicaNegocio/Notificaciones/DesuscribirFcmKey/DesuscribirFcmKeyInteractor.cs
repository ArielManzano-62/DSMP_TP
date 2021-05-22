using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Notificaciones.DesuscribirFcmKey
{
    public class DesuscribirFcmKeyInteractor : IDesuscribirFcmKeyInteractor
    {
        private readonly IUnitOfWork _repositorio;

        public DesuscribirFcmKeyInteractor(IUnitOfWork repo)
        {
            _repositorio = repo;
        }

        public void Unregister(string usuarioId, string token)
        {
            var usuario = _repositorio.Usuarios.Get(usuarioId);
            if (usuario == null) return;
            var key = usuario.Keys.Where(x => x.Key.Equals(token)).FirstOrDefault();
            if (key == null) return;
            usuario.Keys.Remove(key);
            _repositorio.Usuarios.Update(usuario);
            _repositorio.Complete();
            return;
        }
    }
}
