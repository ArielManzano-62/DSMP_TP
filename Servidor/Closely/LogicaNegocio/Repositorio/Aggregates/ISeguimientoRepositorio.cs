using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Repositorio.Aggregates
{
    public interface ISeguimientoRepositorio : IRepositorio<SeguimientoVirtual>
    {
        SeguimientoVirtual GetWithUser(Guid seguimientoId);
        SeguimientoVirtual GetWithUserAndGroups(Guid seguimientoId);
    }
}
