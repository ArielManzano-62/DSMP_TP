using LogicaNegocio.Repositorio;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.AnalizarWebhook.Strategies
{
    public interface ISuscriptionWebhookStrategy
    {
        Task Execute(string suscripcionId, IUnitOfWork repositorio);
    }
}
