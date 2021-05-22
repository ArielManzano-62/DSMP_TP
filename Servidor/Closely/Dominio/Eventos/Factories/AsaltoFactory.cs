﻿using Dominio.Grupos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dominio.Eventos.Factories
{
    public class AsaltoFactory : EventoFactory
    {
        public override Evento Crear()
        {
            Evento evento = new Asalto();
            foreach (Grupo g in _user.Grupos)
            {
                if (g.IntegranteTieneActivadoEvento(_user.Id, evento.Tipo))
                    evento.Notificados.Add(g);

            }
            return evento;
        }

    }
}
