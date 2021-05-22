using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Usuarios.AnalizarWebhook
{
    public interface IAnalizarWebhookInteractor
    {
        Task Analizar(WebhookRequestData data);
    }
}
