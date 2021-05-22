using Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class GrupoSeguimientoConfiguration : IEntityTypeConfiguration<GrupoSeguimiento>
    {
        public void Configure(EntityTypeBuilder<GrupoSeguimiento> builder)
        {
            builder.HasKey(gs => new { gs.GrupoId, gs.SeguimientoVirtualId });
            builder.HasOne(gs => gs.Grupo)
                .WithMany("GrupoSeguimiento")
                .HasForeignKey(gs => gs.GrupoId);
            builder.HasOne(gs => gs.SeguimientoVirtual)
                .WithMany("GrupoSeguimiento")
                .HasForeignKey(gs => gs.SeguimientoVirtualId);
        }
    }
}
