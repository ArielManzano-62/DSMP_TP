using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos
{
    public class RegistroMensaje
    {
        public Guid EventoId { get; private set; }
        public int NroMensaje { get; private set; }
        public DateTime FechaHoraMensaje { get; private set; }
        public string UsuarioId { get; private set; }
        public Mensaje Mensaje { get; set; }

        private RegistroMensaje()
        {
            FechaHoraMensaje = DateTime.Now;
        }

        public RegistroMensaje(Guid eventoId, int nroMensaje, Usuario usuario, string mensaje) : this()
        {
            EventoId = eventoId;
            NroMensaje = nroMensaje;
            UsuarioId = usuario.Id;
            Mensaje = new Mensaje(mensaje, $"{usuario.Nombre} {usuario.Apellido}");
        }
    }
}
