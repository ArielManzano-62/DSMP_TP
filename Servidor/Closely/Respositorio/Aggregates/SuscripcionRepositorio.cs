using Dominio.Suscripciones;
using Dominio.Suscripciones.Estado;
using LogicaNegocio.Repositorio;
using LogicaNegocio.Repositorio.Aggregates;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Respositorio.Aggregates
{
    public class SuscripcionRepositorio : Repositorio<Suscripcion>, ISuscripcionRepositorio
    {
        public SuscripcionRepositorio(DbContext context) : base(context) { }

    }
}
