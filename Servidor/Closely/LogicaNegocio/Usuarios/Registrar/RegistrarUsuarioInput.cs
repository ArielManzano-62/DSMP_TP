using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.Registrar
{
    public class RegistrarUsuarioInput
    {
        public string UserId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string FotoUrl { get; set; }
        public string Email { get; set; }
    }
}
