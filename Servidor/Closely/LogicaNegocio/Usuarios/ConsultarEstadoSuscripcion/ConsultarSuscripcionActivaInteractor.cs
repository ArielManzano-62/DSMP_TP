using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.ConsultarEstadoSuscripcion
{
    public class ConsultarSuscripcionActivaInteractor : IConsultarSuscripcionActivaInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly ISubscriptionService _subscriptionService;

        public ConsultarSuscripcionActivaInteractor(IUnitOfWork repo, ISubscriptionService subService)
        {
            _repositorio = repo;
            _subscriptionService = subService;
        }

        public bool Consultar(string userId)
        {
            if (userId == "" || userId == null) throw new ArgumentNullException("userId", "User Id fue null");

            var user = _repositorio.Usuarios.GetWithSuscripciones(userId);
            if (user == null) throw new ArgumentException($"No existe usuario con id {userId}");

            if (user.TieneSuscripcionActiva()) return true;
            if (!user.TieneSuscripcionEsperandoAprobacion()) return false;
            var subEsperandoAprobacion = user.ObtenerSuscripcionEsperandoAprobacion();
            var status = _subscriptionService.GetSubscriptionState(subEsperandoAprobacion.Id);
            if (status == Adapters.PayPalAdapter.PayPalAdapter.SubscriptionStatus.ACTIVE) return true;
            return false;

        }
    }
}
