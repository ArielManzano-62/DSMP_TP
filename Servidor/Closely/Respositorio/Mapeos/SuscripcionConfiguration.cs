using Dominio.Suscripciones;
using Dominio.Suscripciones.Estado;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class SuscripcionConfiguration : IEntityTypeConfiguration<Suscripcion>
    {
        public void Configure(EntityTypeBuilder<Suscripcion> builder)
        {
            builder.ToTable("suscripciones");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Fecha);
            builder.Property(s => s.FechaAprobacion);
            builder.Property(s => s.ApproveLink);
            builder.Property(s => s.MotivoCancelacion);
            builder.Property(s => s.PlanId);
            builder.Property(s => s.Estado).HasConversion(new ValueConverter<EstadoSuscripcion, string>(
                v => v.Tipo.ToString("g"),
                v => (EstadoSuscripcion)Activator.CreateInstance(Type.GetType("Dominio.Suscripciones.Estado." + v + ", Dominio")))
            ).HasColumnName("Estado");
        }
    }
}
