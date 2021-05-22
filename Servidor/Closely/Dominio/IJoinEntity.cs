using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio
{
    public interface IJoinEntity<TEntity>
    {
        TEntity Navigation { get; set; }
    }
}
