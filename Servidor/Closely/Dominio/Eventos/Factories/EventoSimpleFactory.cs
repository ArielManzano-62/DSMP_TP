using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos.Factories
{
    public class EventoSimpleFactory
    {
        public EventoFactory DeterminarFactory(string tipoEvento)
        {
            tipoEvento = tipoEvento.ToLower();
            switch (tipoEvento)
            {
                case "asalto":
                    return new AsaltoFactory();
                case "emergencia medica":
                    return new EmergenciaMedicaFactory();
                case "incendio":
                    return new IncendioFactory();
                default:
                    throw new ArgumentException("El tipo de evento no fue correcto", "tipoEvento");
            }
        }
    }
}
