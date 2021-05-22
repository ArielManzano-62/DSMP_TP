using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LogicaNegocio.Usuarios.AprobarSuscripcion
{
    public class AprobarSuscripcionInteractor : IAprobarSuscripcionInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly ISubscriptionService _subscriptionService;

        public AprobarSuscripcionInteractor(
            IUnitOfWork repo,
            ISubscriptionService subService)
        {
            _repositorio = repo;
            _subscriptionService = subService;
        }

        public bool Aprobar(AprobarSuscripcionInput input)
        {
            if (input == null) throw new ArgumentException("Inpu fue null");
            if (input.UsuarioId == "" || input.UsuarioId == null) throw new ArgumentException("Usuario Id fue null");
            if (input.SuscripcionId == "" || input.SuscripcionId == null) throw new ArgumentException("Suscripcion Id fue null");

            var user = _repositorio.Usuarios.GetWithSuscripciones(input.UsuarioId);
            if (user == null) throw new ArgumentException($"No existe usuario con Id {input.UsuarioId}");

            var suscripcion = user.Suscripciones.Where(s => s.Id == input.SuscripcionId).FirstOrDefault();
            if (suscripcion == null)
            {
                Console.WriteLine("Algo paso");
                return false;
            }

            if (suscripcion.EstaActiva()) return true;
            

            var status = _subscriptionService.GetSubscriptionState(suscripcion.Id);
            if (status != Adapters.PayPalAdapter.PayPalAdapter.SubscriptionStatus.ACTIVE)
            {
                return false;
            }

            suscripcion.Aprobar();

            _repositorio.Usuarios.Update(user);
            _repositorio.Complete();

            return true;
        }

    }
}
