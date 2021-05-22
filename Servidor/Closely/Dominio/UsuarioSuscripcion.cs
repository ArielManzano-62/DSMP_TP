using Dominio.Suscripciones;
using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio
{
    public class UsuarioSuscripcion : IJoinEntity<Usuario>, IJoinEntity<Suscripcion>
    {
        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        Usuario IJoinEntity<Usuario>.Navigation
        {
            get => Usuario;
            set => Usuario = value;
        }

        public string SuscripcionId { get; set; }
        public Suscripcion Suscripcion { get; set; }
        Suscripcion IJoinEntity<Suscripcion>.Navigation
        {
            get => Suscripcion;
            set => Suscripcion = value;
        }
    }
}
