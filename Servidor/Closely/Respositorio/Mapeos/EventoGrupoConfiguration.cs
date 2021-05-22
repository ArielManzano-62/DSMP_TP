using Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class EventoGrupoConfiguration : IEntityTypeConfiguration<EventoGrupo>
    {
        public void Configure(EntityTypeBuilder<EventoGrupo> builder)
        {
            builder.HasKey(eg => new { eg.EventoId, eg.GrupoId });
            builder.HasOne(eg => eg.Evento)
                .WithMany("GruposEvento")
                .HasForeignKey(eg => eg.EventoId);
            builder.HasOne(eg => eg.Grupo)
                .WithMany("GruposEvento")
                .HasForeignKey(eg => eg.GrupoId);
        }
    }
}
