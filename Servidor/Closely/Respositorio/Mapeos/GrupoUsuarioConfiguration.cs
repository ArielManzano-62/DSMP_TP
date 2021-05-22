using Dominio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class GrupoUsuarioConfiguration : IEntityTypeConfiguration<GrupoUsuario>
    {
        public void Configure(EntityTypeBuilder<GrupoUsuario> builder)
        {
            builder.HasKey(gu => new { gu.GrupoId, gu.UsuarioId });
            builder.HasOne(gu => gu.Grupo)
                .WithMany("GrupoUsuarios")
                .HasForeignKey(gu => gu.GrupoId);
            builder.HasOne(gu => gu.Usuario)
                .WithMany("GrupoUsuarios")
                .HasForeignKey(gu => gu.UsuarioId);
        }
    }
}
