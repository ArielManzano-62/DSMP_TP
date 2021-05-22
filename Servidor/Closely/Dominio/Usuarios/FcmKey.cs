using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Usuarios
{
    public class FcmKey
    {
        public DateTime FechaHora { get; private set; }
        public string Key { get; private set; }

        private FcmKey() { }

        public FcmKey(string key)
        {
            Key = key;
            FechaHora = DateTime.Now;
        }
    }
}
