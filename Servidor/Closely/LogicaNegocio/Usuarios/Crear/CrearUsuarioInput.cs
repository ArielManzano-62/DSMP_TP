using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Usuarios.Crear
{
    public class CrearUsuarioInput
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
    }
}
