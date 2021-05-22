using Dominio.Suscripciones.Estado;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Suscripciones
{
    public class Suscripcion
    {
        public string Id { get; private set; }
        public DateTime Fecha { get; private set; }
        public string PlanId { get; private set; } = "P-97U865220K223940XLWXA53Y";
        public string ApproveLink { get; private set; }
        public EstadoSuscripcion Estado { get; set; }
        public DateTime FechaAprobacion { get; internal set; }
        public string MotivoCancelacion { get; internal set; }

        private Suscripcion() { }

        public Suscripcion(string id, DateTime fecha, string approveLink)
        {
            Id = id;
            Fecha = fecha;
            ApproveLink = approveLink;
            Estado = new EsperandoAprobacion();
        }

        public void Aprobar()
        {
            Estado.Aprobar(this);
        }

        public void Cancelar(string motivo)
        {
            Estado.Cancelar(this, motivo);
        }

        public void Suspender()
        {
            Estado.Suspender(this);
        }

        public bool EstaActiva()
        {
            return Estado.EsActiva();
        }

        public bool EstaCancelada()
        {
            return Estado.EsCancelada();
        }

        public bool EstaEsperandoAprobacion()
        {
            return Estado.EsEsperandoAprobacion();
        }
    }
}
