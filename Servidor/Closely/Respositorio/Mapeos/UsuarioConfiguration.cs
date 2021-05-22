using Dominio;
using Dominio.Eventos;
using Dominio.Seguimientos;
using Dominio.Usuarios;
using Dominio.Usuarios.Estados;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Nombre).IsRequired().HasMaxLength(40).HasColumnName("nombre");
            builder.Property(u => u.Apellido).IsRequired().HasMaxLength(40).HasColumnName("apellido");
            builder.Property(u => u.FotoUrl);
            builder.Property(u => u.Email);
            builder.HasIndex(i => i.Email);
            builder.Property(u => u.Codigo);
            builder.OwnsMany(u => u.Keys, k =>
            {
                k.ToTable("usuarios_fcmkeys");
                k.Property<Guid>("Id");
                k.HasKey("Id");
                k.Property(x => x.FechaHora);
                k.Property(x => x.Key);
            });
            builder.HasMany(u => u.Seguimientos)
                .WithOne(s => s.Usuario)
                .HasForeignKey("UsuarioId");
            builder.HasOne(u => u.SeguimientoActual).WithOne().HasForeignKey<SeguimientoVirtual>("UsuarioId").OnDelete(DeleteBehavior.SetNull);
            builder.HasMany<GrupoUsuario>("GrupoUsuarios")
                .WithOne("Usuario")
                .HasForeignKey("UsuarioId");
            builder.Ignore(u => u.Grupos);
            builder.Property(s => s.Estado).HasConversion(new ValueConverter<EstadoUsuario, string>(
                v => v.Tipo.ToString("g"),
                v => (EstadoUsuario)Activator.CreateInstance(Type.GetType("Dominio.Usuarios.Estados." + v + ", Dominio")))
            ).HasColumnName("Estado");
            builder.HasOne(u => u.EventoActual).WithOne().HasForeignKey<Evento>("UsuarioId").OnDelete(DeleteBehavior.SetNull);
            builder.HasMany(u => u.Eventos).WithOne().HasForeignKey("UsuarioId");
            builder.HasMany<UsuarioSuscripcion>("UsuarioSuscripciones")
                .WithOne("Usuario")
                .HasForeignKey("UsuarioId");
            builder.Ignore(u => u.Suscripciones);
        }
    }
}
