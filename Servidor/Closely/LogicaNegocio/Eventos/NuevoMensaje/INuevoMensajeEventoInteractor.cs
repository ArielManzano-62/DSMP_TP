using Dominio.Eventos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.NuevoMensaje
{
    public interface INuevoMensajeEventoInteractor
    {
        RegistroMensaje Registrar(string contenido, string userId, Guid eventoId);
    }
}
