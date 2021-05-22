using Dominio.Usuarios;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Grupos
{
    public class RegistroMensaje
    {
        public Guid GrupoId { get; private set; }
        public int NroMensaje { get; private set; }
        public DateTime FechaHoraMensaje { get; private set; }
        public string IntegranteId { get; private set; }
        public Mensaje Mensaje { get; set; }

        private RegistroMensaje()
        {
            FechaHoraMensaje = DateTime.Now;
        }

        public RegistroMensaje(Guid grupoId, int nroMensaje, Usuario integrante, string mensaje) : this()
        {
            GrupoId = grupoId;
            NroMensaje = nroMensaje;
            IntegranteId = integrante.Id;
            Mensaje = new Mensaje(mensaje, $"{integrante.Nombre} {integrante.Apellido}");
        }

    }
}
