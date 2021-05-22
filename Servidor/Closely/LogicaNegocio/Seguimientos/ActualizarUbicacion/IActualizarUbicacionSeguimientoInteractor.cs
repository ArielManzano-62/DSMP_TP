using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Seguimientos.ActualizarUbicacion
{
    public interface IActualizarUbicacionSeguimientoInteractor
    {
        Task<ActualizarUbicacionOutput> Actualizar(Guid seguimientoId, double latitude, double longitude);
    }
}
