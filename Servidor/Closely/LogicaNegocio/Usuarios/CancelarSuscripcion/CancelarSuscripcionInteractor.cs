using Dominio.Suscripciones;
using Dominio.Usuarios;
using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.CancelarSuscripcion
{
    public class CancelarSuscripcionInteractor : ICancelarSuscripcionInteractor
    {
        private readonly IUnitOfWork _repositorio;
        private readonly ISubscriptionService _subscriptionService;

        public CancelarSuscripcionInteractor(
            IUnitOfWork repositorio,
            ISubscriptionService subscriptionService)
        {
            _repositorio = repositorio;
            _subscriptionService = subscriptionService;
        }

        public async Task Cancelar(string userId, string motivo)
        {
            if (String.IsNullOrEmpty(motivo)) throw new ArgumentNullException(paramName: "motivo", message: "Fue null");

            //Chequear que este suscripto
            Usuario user = _repositorio.Usuarios.GetWithSuscripciones(userId);            
            if (!user.TieneSuscripcionActiva()) throw new Exception(message: "El usuario no posee suscripciones activas");
            Suscripcion suscripcionActiva = user.ObtenerSuscripcionActiva();            

            //Hacer peticion a paypal
            bool response = await _subscriptionService.CancelSubscription(suscripcionActiva.Id, motivo);
            if (!response) throw new InvalidOperationException(message: "Algo paso mal con paypal");

            //Si la respuesta es correcta, sacarlo de la db
            suscripcionActiva.Cancelar(motivo);
            _repositorio.Usuarios.Update(user);
            _repositorio.Complete();

            //TODO: cuando cambie la forma de validar el pago, cambiar aca tmb el dato del usuario.
        } 
    }
}
