using Dominio;
using Dominio.Eventos;
using Dominio.Eventos.Estados;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Text;

namespace Respositorio.Mapeos
{
    public class EventoConfiguration : IEntityTypeConfiguration<Evento>
    {
        public void Configure(EntityTypeBuilder<Evento> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.FechaHoraInicio);
            builder.Property(e => e.FechaHoraFin);
            builder.Ignore(e => e.Tipo);
            builder.HasMany<EventoGrupo>("GruposEvento").WithOne("Evento").HasForeignKey("GrupoId");
            builder.Property(s => s.Estado).HasConversion(new ValueConverter<EstadoEvento, string>(
                v => v.TipoEstado.ToString("g"),
                v => (EstadoEvento)Activator.CreateInstance(Type.GetType("Dominio.Eventos.Estados." + v + ", Dominio")))
            ).HasColumnName("Estado");
            builder.Ignore(e => e.Notificados);
            builder.OwnsMany(e => e.Mensajes, m =>
            {
                m.ToTable("evento_mensajes");
                m.HasForeignKey(x => x.EventoId);
                m.Property(x => x.FechaHoraMensaje);
                m.Property(x => x.UsuarioId);
                m.Property(x => x.NroMensaje);
                m.OwnsOne(x => x.Mensaje);
                m.HasKey(x => new { x.EventoId, x.NroMensaje });
            });
            builder.OwnsMany(e => e.Ubicaciones, u =>
            {
                u.HasKey(x => new { x.Latitude, x.Longitude, x.FechaHora });
                u.ToTable("Ubicaciones");
                u.Property(x => x.FechaHora);
                u.Property(x => x.Latitude);
                u.Property(x => x.Longitude);
            });

            builder.OwnsOne(e => e.Resolucion, r =>
            {
                r.ToTable("Resoluciones");
                r.Property(x => x.Descripcion);
                r.Property(x => x.EstadoFinal);
            });
            builder.HasDiscriminator<string>("TipoEvento")
                .HasValue<Asalto>(nameof(Asalto))
                .HasValue<EmergenciaMedica>(nameof(EmergenciaMedica))
                .HasValue<Incendio>(nameof(Incendio));
        }
    }
}
