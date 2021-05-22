using Dominio.Grupos;
using Dominio.Seguimientos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio
{
    public class GrupoSeguimiento : IJoinEntity<Grupo>, IJoinEntity<SeguimientoVirtual>
    {
        public Guid GrupoId { get; set; }
        public virtual Grupo Grupo { get; set; }
        Grupo IJoinEntity<Grupo>.Navigation
        {
            get => Grupo;
            set => Grupo = value;
        }

        public Guid SeguimientoVirtualId { get; set; }
        public virtual SeguimientoVirtual SeguimientoVirtual { get; set; }
        SeguimientoVirtual IJoinEntity<SeguimientoVirtual>.Navigation
        {
            get => SeguimientoVirtual;
            set => SeguimientoVirtual = value;
        }
    }
}
