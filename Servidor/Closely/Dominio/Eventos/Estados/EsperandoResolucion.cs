using System;
using System.Collections.Generic;
using System.Text;
using static Dominio.Eventos.Resolucion;

namespace Dominio.Eventos.Estados
{
    public class EsperandoResolucion : EstadoEvento
    {
        public EsperandoResolucion() : base(TipoEstadoEvento.EsperandoResolucion) { }

        public override bool EstaEnTranscurso()
        {
            return false;
        }

        public override void Finalizar(Evento e)
        {
            throw new InvalidOperationException("El evento ya se encuentra finalizado, debe Entregar una resolucion");
        }

        public override void Resolver(Evento e, string descripcion, int estado)
        {
            EstadoFinalUsuario? estadoFinal;
            switch (estado)
            {
                case 1:
                    estadoFinal = EstadoFinalUsuario.MuyMal;
                    break;
                case 2:
                    estadoFinal = EstadoFinalUsuario.Mal;
                    break;
                case 3:
                    estadoFinal = EstadoFinalUsuario.Regular;
                    break;
                case 4:
                    estadoFinal = EstadoFinalUsuario.Bien;
                    break;
                case 5:
                    estadoFinal = EstadoFinalUsuario.MuyBien;
                    break;
                default:
                    estadoFinal = null;
                    break;
            }

            Resolucion res = new Resolucion(descripcion, estadoFinal);
            e.Resolucion = res;
            e.Estado = new Finalizado();
        }

        public override string ToString()
        {
            return "Esperando Resolucion";
        }
    }
}
