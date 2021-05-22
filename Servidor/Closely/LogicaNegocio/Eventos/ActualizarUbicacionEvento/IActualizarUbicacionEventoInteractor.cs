using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Eventos.ActualizarUbicacionEvento
{
    public interface IActualizarUbicacionEventoInteractor
    {
        void ActualizarUbicacion(Guid eventoId, double latitude, double longitude);
    }
}
