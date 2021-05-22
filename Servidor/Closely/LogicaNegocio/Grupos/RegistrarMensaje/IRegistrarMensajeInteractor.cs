using Dominio.Grupos;
using System;
using System.Collections.Generic;
using System.Text;

namespace LogicaNegocio.Grupos.RegistrarMensaje
{
    public interface IRegistrarMensajeInteractor
    {
        void NuevoMensaje(string message, string integranteId, Guid grupoId);
    }
}
