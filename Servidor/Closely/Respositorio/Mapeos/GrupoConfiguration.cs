using Dominio;
using Dominio.Grupos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class GrupoConfiguration : IEntityTypeConfiguration<Grupo>
    {
        public void Configure(EntityTypeBuilder<Grupo> builder)
        {
            builder.HasKey(g => g.Id);
            builder.Property(g => g.Nombre);
            builder.Property(g => g.FotoUrl);
            builder.Property(g => g.FechaHoraCreacion);
            builder.HasOne(g => g.Administrador);
            builder.HasMany<GrupoUsuario>("GrupoUsuarios")
                .WithOne("Grupo")
                .HasForeignKey(gu => gu.GrupoId);
            builder.HasMany<EventoGrupo>("GruposEvento")
                .WithOne("Grupo")
                .HasForeignKey("GrupoId");
            builder.HasMany<GrupoSeguimiento>("GrupoSeguimiento")
                .WithOne("Grupo")
                .HasForeignKey("GrupoId");
            builder.Ignore(g => g.Seguimientos);
            builder.Ignore(g => g.Eventos);
            builder.Ignore(g => g.Integrantes);
            builder.OwnsMany(g => g.Configuraciones, c =>
            {
                c.ToTable("grupos_configuraciones");
                c.Property<Guid>("Id");
                c.HasKey("Id");
                c.Property(x => x.UsuarioId);
                c.OwnsMany(x => x.ConfiguracionesEvento, ce =>
                {
                    ce.ToTable("grupos_configuraciones_configevento");
                    ce.Property<Guid>("Id");
                    ce.HasKey("Id");
                    ce.Property(x => x.TipoEvento);
                    ce.Property(x => x.Activado);
                });
            });
            builder.OwnsMany(g => g.HistorialMensajes, hm =>
            {
                hm.ToTable("grupos_mensajes");
                hm.HasForeignKey(x => x.GrupoId);
                hm.Property(x => x.NroMensaje);
                hm.Property(x => x.FechaHoraMensaje);
                hm.Property(x => x.IntegranteId);
                hm.OwnsOne(x => x.Mensaje);
                hm.HasKey(x => new { x.GrupoId, x.NroMensaje });
            });
        }
    }
}
