using Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class UsuarioSuscripcionConfiguration : IEntityTypeConfiguration<UsuarioSuscripcion>
    {
        public void Configure(EntityTypeBuilder<UsuarioSuscripcion> builder)
        {
            builder.HasKey(us => new { us.SuscripcionId, us.UsuarioId} );
            builder.HasOne(us => us.Suscripcion)
                .WithMany()
                .HasForeignKey(us => us.SuscripcionId);
            builder.HasOne(us => us.Usuario)
                .WithMany("UsuarioSuscripciones")
                .HasForeignKey(us => us.UsuarioId);
        }
    }
}
