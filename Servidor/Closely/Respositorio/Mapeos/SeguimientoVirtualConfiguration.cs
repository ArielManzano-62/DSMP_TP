using Dominio;
using Dominio.Seguimientos;
using Dominio.Seguimientos.Estado;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class SeguimientoVirtualConfiguration: IEntityTypeConfiguration<SeguimientoVirtual>
    {
        public void Configure(EntityTypeBuilder<SeguimientoVirtual> builder)
        {
            builder.HasKey(sv => sv.Id);
            builder.Property(sv => sv.FechaHoraInicio);
            builder.Property(sv => sv.FechaHoraFin);
            builder.HasOne(sv => sv.Usuario)
                .WithMany(u => u.Seguimientos)
                .HasForeignKey("UsuarioId");
            builder.HasMany<GrupoSeguimiento>("GrupoSeguimiento")
                .WithOne("SeguimientoVirtual")
                .HasForeignKey(gs => gs.SeguimientoVirtualId);
            builder.Ignore(sv => sv.Grupos);
            builder.Property(s => s.Estado).HasConversion(new ValueConverter<SeguimientoEstado, string>(
                v => v.TipoEstado.ToString("g"),
                v => (SeguimientoEstado)Activator.CreateInstance(Type.GetType("Dominio.Seguimientos.Estado." + v + ", Dominio")))
            ).HasColumnName("Estado");
            builder.OwnsMany(sv => sv.Ubicaciones, u =>
            {
                u.ToTable("Seguimientos_Ubicaciones");
                u.Property(x => x.FechaHora);
                u.Property<Guid>("Id");
                u.HasKey("Id");
                u.OwnsOne(x => x.Posicion);
            });
            builder.OwnsOne(sv => sv.Ruta, r =>
            {
                r.ToTable("Seguimientos_Rutas");
                r.Property(x => x.Modo);
                r.Property(x => x.EncodedPolyline);
                r.Property(x => x.DireccionDestino);
                r.OwnsOne(x => x.Origen);
                r.OwnsOne(x => x.Destino);
                r.OwnsMany(x => x.Waypoints, w =>
                {
                    w.ToTable("Seguimientos_Rutas_Waypoints");
                    w.Property<Guid>("Id");
                    w.HasKey("Id");
                    w.Property(x => x.Latitude);
                    w.Property(x => x.Longitude);
                });
            });


        }
    }
}
