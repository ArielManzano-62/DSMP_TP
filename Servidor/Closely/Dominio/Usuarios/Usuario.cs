using Dominio.Eventos;
using Dominio.Grupos;
using Dominio.Seguimientos;
using Dominio.Suscripciones;
using Dominio.Usuarios.Estados;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Dominio.Usuarios
{
    public class Usuario
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string FotoUrl { get; set; }
        public string Email { get; set; }
        public string Codigo { get; set; }
        public EstadoUsuario Estado { get; set; }
        public ICollection<FcmKey> Keys { get; private set; }
        public ICollection<Evento> Eventos { get; set; } = new List<Evento>();
        public Evento EventoActual { get; set; }
        private ICollection<GrupoUsuario> GrupoUsuarios { get; } = new List<GrupoUsuario>();
        public ICollection<Grupo> Grupos { get; }
        private ICollection<UsuarioSuscripcion> UsuarioSuscripciones { get; } = new List<UsuarioSuscripcion>();
        public ICollection<Suscripcion> Suscripciones { get; }
        public ICollection<SeguimientoVirtual> Seguimientos { get; } = new List<SeguimientoVirtual>();
        public SeguimientoVirtual SeguimientoActual { get; set; }


        private Usuario()
        {
            Grupos = new JoinCollectionFacade<Grupo, Usuario, GrupoUsuario>(this, GrupoUsuarios);
            Suscripciones = new JoinCollectionFacade<Suscripcion, Usuario, UsuarioSuscripcion>(this, UsuarioSuscripciones);
            Estado = new Tranquilo();
            Keys = new List<FcmKey>();
        }

        public Usuario(string id, string nombre, string apellido, string email, string fotoUrl) : this()
        {
            Id = id;
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            FotoUrl = fotoUrl;
        }

        public Evento EnviarEvento(string tipoEvento)
        {
            return Estado.EnviarEvento(tipoEvento, this);
        }

        public void FinalizarEvento(string codigo)
        {
            if (!ValidarCodigo(codigo)) { throw new ArgumentException("Codigo " + codigo + " Invalido"); }
            this.Estado.FinalizarEvento(this);
        }

        public void IniciarSeguimiento(SeguimientoVirtual seguimiento)
        {
            this.Estado.IniciarSeguimiento(this, seguimiento);
        }

        public void FinalizarSeguimiento(string codigo)
        {
            if (!ValidarCodigo(codigo)) { throw new ArgumentException(paramName: "codigo", message:"Codigo " + codigo + " Invalido"); }
            this.Estado.FinalizarSeguimiento(this);
        }

        public void FinalizarSeguimientoAutomaticamente()
        {
            this.Estado.FinalizarSeguimiento(this);
        }

        public bool EstaTranquilo()
        {
            return Estado.EstaTranquilo();
        }

        public bool EstaEnSeguimiento()
        {
            return Estado.EsEnSeguimiento();
        }

        public Evento ResolverEvento(string descripcion, int estadoFinal)
        {
            return Estado.ResolverEvento(this, descripcion, estadoFinal);
        }

        public bool TieneSuscripcionActiva()
        {
            foreach (Suscripcion sub in Suscripciones)
            {
                if (sub.EstaActiva())
                    return true;
            }
            return false;
        }

        public bool TieneSuscripcionEsperandoAprobacion()
        {
            foreach (Suscripcion sub in Suscripciones)
            {
                if (sub.EstaEsperandoAprobacion())
                    return true;
            }
            return false;
        }

        public Suscripcion ObtenerSuscripcionEsperandoAprobacion()
        {
            foreach (Suscripcion sub in Suscripciones)
            {
                if (sub.EstaEsperandoAprobacion())
                    return sub;
            }
            return null;
        }

        public Suscripcion ObtenerSuscripcionActiva()
        {
            foreach (Suscripcion sub in Suscripciones)
            {
                if (sub.EstaActiva())
                    return sub;
            }
            return null;
        }

        public void ActualizarCodigo(string codigoAntiguo, string codigoNuevo)
        {
            if (!string.IsNullOrWhiteSpace(Codigo))
            {
                if (Codigo != codigoAntiguo) throw new Exception("Codigo actual erroneo");
            }
            if (codigoNuevo == null || codigoNuevo == "") throw new ArgumentException("El codigo nuevo fue null");
            Regex regex = new Regex(@"^\d{4}$");
            if (!regex.IsMatch(codigoNuevo)) throw new FormatException("El formato del codigo nuevo no es valido");
            Codigo = codigoNuevo;
        }

        /*public override bool Equals(object obj)
        {
            Usuario user = (Usuario)obj;
            if (user.Id == this.Id)
                return true;
            else
                return false;
        }*/


        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        private bool ValidarCodigo(string codigo)
        {
            if (!codigo.Equals(Codigo) || codigo == null) return false;
            return true;
        }
    }
}
