using Dominio.Seguimientos;
using LogicaNegocio.Repositorio.Aggregates;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Respositorio.Aggregates
{
    public class SeguimientoRepositorio : Repositorio<SeguimientoVirtual>, ISeguimientoRepositorio
    {
        public SeguimientoRepositorio(DbContext context) : base(context) { }

        public SeguimientoVirtual GetWithUser(Guid seguimientoId)
        {
            return Context.Set<SeguimientoVirtual>().Where(sv => sv.Id == seguimientoId).Include(sv => sv.Usuario).FirstOrDefault();
        }

        public SeguimientoVirtual GetWithUserAndGroups(Guid seguimientoId)
        {
            return Context.Set<SeguimientoVirtual>().Where(sv => sv.Id == seguimientoId).Include(sv => sv.Usuario).Include("GrupoSeguimiento.Grupo.GrupoUsuarios.Usuario").FirstOrDefault();
        }
    }
}
