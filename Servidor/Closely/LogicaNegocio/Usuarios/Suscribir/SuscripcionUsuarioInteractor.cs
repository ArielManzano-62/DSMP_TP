using Dominio.Suscripciones;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.Suscribir
{
    public class SuscripcionUsuarioInteractor : ISuscripcionUsuarioInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly ISubscriptionService _subscriptionService;

        public SuscripcionUsuarioInteractor(IUnitOfWork repo, ISubscriptionService subService)
        {
            _repositorio = repo;
            _subscriptionService = subService;
        }

        public SuscripcionOutput Subscribir(string userId)
        {
            if (userId == "" || userId == null) throw new ArgumentNullException("userId", "UserId fue null");
            var user = _repositorio.Usuarios.GetWithSuscripciones(userId);
            if (user == null) throw new ArgumentException($"No existe usuario con Id {userId}");

            if (user.TieneSuscripcionActiva()) return null;

            if (user.TieneSuscripcionEsperandoAprobacion())
            {
                var suscripcion = user.ObtenerSuscripcionEsperandoAprobacion();
                user.Suscripciones.Remove(suscripcion);
                _repositorio.Suscripciones.Remove(suscripcion);
            }

            var response = _subscriptionService.CreateSuscription(user);
            Suscripcion nuevaSuscripcion = new Suscripcion(response.Id, response.FechaHoraCreacion, response.ApproveLink);

            user.Suscripciones.Add(nuevaSuscripcion);

            _repositorio.Usuarios.Update(user);
            _repositorio.Complete();

            return new SuscripcionOutput
            {
                ApproveLink = nuevaSuscripcion.ApproveLink,
                SuscripcionId = nuevaSuscripcion.Id
            };
        }
    }
}
