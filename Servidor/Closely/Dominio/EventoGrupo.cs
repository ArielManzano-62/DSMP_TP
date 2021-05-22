using Dominio.Eventos;
using Dominio.Grupos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio
{
    public class EventoGrupo : IJoinEntity<Evento>, IJoinEntity<Grupo>
    {
        public Guid EventoId { get; set; }
        public virtual Evento Evento { get; set; }
        Evento IJoinEntity<Evento>.Navigation
        {
            get => Evento;
            set => Evento = value;
        }
        public Guid GrupoId { get; set; }
        public virtual Grupo Grupo { get; set; }
        Grupo IJoinEntity<Grupo>.Navigation
        {
            get => Grupo;
            set => Grupo = value;
        }
    }
}
