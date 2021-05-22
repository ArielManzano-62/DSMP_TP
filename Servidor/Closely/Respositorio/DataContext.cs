using Microsoft.EntityFrameworkCore;
using Respositorio.Mapeos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.ApplyConfiguration(new EventoConfiguration());
            modelBuilder.ApplyConfiguration(new GrupoConfiguration());
            modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
            modelBuilder.ApplyConfiguration(new EventoGrupoConfiguration());
            modelBuilder.ApplyConfiguration(new GrupoUsuarioConfiguration());
            modelBuilder.ApplyConfiguration(new SuscripcionConfiguration());
            modelBuilder.ApplyConfiguration(new UsuarioSuscripcionConfiguration());
            modelBuilder.ApplyConfiguration(new GrupoSeguimientoConfiguration());
            modelBuilder.ApplyConfiguration(new SeguimientoVirtualConfiguration());
        }
       
    }
}
