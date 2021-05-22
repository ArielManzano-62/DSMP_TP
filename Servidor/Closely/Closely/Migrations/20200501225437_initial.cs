using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Closely.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "suscripciones",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Fecha = table.Column<DateTime>(nullable: false),
                    PlanId = table.Column<string>(nullable: true),
                    ApproveLink = table.Column<string>(nullable: true),
                    Estado = table.Column<string>(nullable: true),
                    FechaAprobacion = table.Column<DateTime>(nullable: false),
                    MotivoCancelacion = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_suscripciones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "evento_mensajes",
                columns: table => new
                {
                    EventoId = table.Column<Guid>(nullable: false),
                    NroMensaje = table.Column<int>(nullable: false),
                    FechaHoraMensaje = table.Column<DateTime>(nullable: false),
                    UsuarioId = table.Column<string>(nullable: true),
                    Mensaje_Contenido = table.Column<string>(nullable: true),
                    Mensaje_NombreEmisor = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_evento_mensajes", x => new { x.EventoId, x.NroMensaje });
                });

            migrationBuilder.CreateTable(
                name: "EventoGrupo",
                columns: table => new
                {
                    EventoId = table.Column<Guid>(nullable: false),
                    GrupoId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventoGrupo", x => new { x.EventoId, x.GrupoId });
                });

            migrationBuilder.CreateTable(
                name: "Resoluciones",
                columns: table => new
                {
                    EventoId = table.Column<Guid>(nullable: false),
                    Descripcion = table.Column<string>(nullable: true),
                    EstadoFinal = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resoluciones", x => x.EventoId);
                });

            migrationBuilder.CreateTable(
                name: "Ubicaciones",
                columns: table => new
                {
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    FechaHora = table.Column<DateTime>(nullable: false),
                    EventoId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ubicaciones", x => new { x.Latitude, x.Longitude, x.FechaHora });
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    nombre = table.Column<string>(maxLength: 40, nullable: false),
                    apellido = table.Column<string>(maxLength: 40, nullable: false),
                    FotoUrl = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Codigo = table.Column<string>(nullable: true),
                    Estado = table.Column<string>(nullable: true),
                    EventoActualId = table.Column<Guid>(nullable: true),
                    SeguimientoActualId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Evento",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FechaHoraInicio = table.Column<DateTime>(nullable: false),
                    FechaHoraFin = table.Column<DateTime>(nullable: false),
                    Estado = table.Column<string>(nullable: true),
                    TipoEvento = table.Column<string>(nullable: false),
                    UsuarioId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Evento_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Grupo",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Nombre = table.Column<string>(nullable: true),
                    FotoUrl = table.Column<string>(nullable: true),
                    FechaHoraCreacion = table.Column<DateTime>(nullable: false),
                    AdministradorId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grupo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grupo_Usuario_AdministradorId",
                        column: x => x.AdministradorId,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SeguimientoVirtual",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FechaHoraInicio = table.Column<DateTime>(nullable: false),
                    FechaHoraFin = table.Column<DateTime>(nullable: false),
                    UsuarioId = table.Column<string>(nullable: true),
                    Estado = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeguimientoVirtual", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SeguimientoVirtual_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "usuarios_fcmkeys",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    FechaHora = table.Column<DateTime>(nullable: false),
                    Key = table.Column<string>(nullable: true),
                    UsuarioId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios_fcmkeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_usuarios_fcmkeys_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsuarioSuscripcion",
                columns: table => new
                {
                    UsuarioId = table.Column<string>(nullable: false),
                    SuscripcionId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuarioSuscripcion", x => new { x.SuscripcionId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_UsuarioSuscripcion_suscripciones_SuscripcionId",
                        column: x => x.SuscripcionId,
                        principalTable: "suscripciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UsuarioSuscripcion_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "grupos_configuraciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UsuarioId = table.Column<string>(nullable: true),
                    GrupoId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grupos_configuraciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_grupos_configuraciones_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "grupos_mensajes",
                columns: table => new
                {
                    GrupoId = table.Column<Guid>(nullable: false),
                    NroMensaje = table.Column<int>(nullable: false),
                    FechaHoraMensaje = table.Column<DateTime>(nullable: false),
                    IntegranteId = table.Column<string>(nullable: true),
                    Mensaje_Contenido = table.Column<string>(nullable: true),
                    Mensaje_NombreEmisor = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grupos_mensajes", x => new { x.GrupoId, x.NroMensaje });
                    table.ForeignKey(
                        name: "FK_grupos_mensajes_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrupoUsuario",
                columns: table => new
                {
                    UsuarioId = table.Column<string>(nullable: false),
                    GrupoId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrupoUsuario", x => new { x.GrupoId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_GrupoUsuario_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GrupoUsuario_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrupoSeguimiento",
                columns: table => new
                {
                    GrupoId = table.Column<Guid>(nullable: false),
                    SeguimientoVirtualId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrupoSeguimiento", x => new { x.GrupoId, x.SeguimientoVirtualId });
                    table.ForeignKey(
                        name: "FK_GrupoSeguimiento_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GrupoSeguimiento_SeguimientoVirtual_SeguimientoVirtualId",
                        column: x => x.SeguimientoVirtualId,
                        principalTable: "SeguimientoVirtual",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seguimientos_Rutas",
                columns: table => new
                {
                    SeguimientoVirtualId = table.Column<Guid>(nullable: false),
                    Origen_Latitude = table.Column<double>(nullable: false),
                    Origen_Longitude = table.Column<double>(nullable: false),
                    Destino_Latitude = table.Column<double>(nullable: false),
                    Destino_Longitude = table.Column<double>(nullable: false),
                    Modo = table.Column<string>(nullable: true),
                    EncodedPolyline = table.Column<string>(nullable: true),
                    DireccionDestino = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seguimientos_Rutas", x => x.SeguimientoVirtualId);
                    table.ForeignKey(
                        name: "FK_Seguimientos_Rutas_SeguimientoVirtual_SeguimientoVirtualId",
                        column: x => x.SeguimientoVirtualId,
                        principalTable: "SeguimientoVirtual",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seguimientos_Ubicaciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Posicion_Latitude = table.Column<double>(nullable: false),
                    Posicion_Longitude = table.Column<double>(nullable: false),
                    FechaHora = table.Column<DateTime>(nullable: false),
                    SeguimientoVirtualId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seguimientos_Ubicaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Seguimientos_Ubicaciones_SeguimientoVirtual_SeguimientoVirtu~",
                        column: x => x.SeguimientoVirtualId,
                        principalTable: "SeguimientoVirtual",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "grupos_configuraciones_configevento",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    TipoEvento = table.Column<int>(nullable: false),
                    Activado = table.Column<bool>(nullable: false),
                    ConfiguracionGrupoId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grupos_configuraciones_configevento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_grupos_configuraciones_configevento_grupos_configuraciones_C~",
                        column: x => x.ConfiguracionGrupoId,
                        principalTable: "grupos_configuraciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seguimientos_Rutas_Waypoints",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    RutaSeguimientoVirtualId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seguimientos_Rutas_Waypoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Seguimientos_Rutas_Waypoints_Seguimientos_Rutas_RutaSeguimie~",
                        column: x => x.RutaSeguimientoVirtualId,
                        principalTable: "Seguimientos_Rutas",
                        principalColumn: "SeguimientoVirtualId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Evento_UsuarioId",
                table: "Evento",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_EventoGrupo_GrupoId",
                table: "EventoGrupo",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_Grupo_AdministradorId",
                table: "Grupo",
                column: "AdministradorId");

            migrationBuilder.CreateIndex(
                name: "IX_grupos_configuraciones_GrupoId",
                table: "grupos_configuraciones",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_grupos_configuraciones_configevento_ConfiguracionGrupoId",
                table: "grupos_configuraciones_configevento",
                column: "ConfiguracionGrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_GrupoSeguimiento_SeguimientoVirtualId",
                table: "GrupoSeguimiento",
                column: "SeguimientoVirtualId");

            migrationBuilder.CreateIndex(
                name: "IX_GrupoUsuario_UsuarioId",
                table: "GrupoUsuario",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Seguimientos_Rutas_Waypoints_RutaSeguimientoVirtualId",
                table: "Seguimientos_Rutas_Waypoints",
                column: "RutaSeguimientoVirtualId");

            migrationBuilder.CreateIndex(
                name: "IX_Seguimientos_Ubicaciones_SeguimientoVirtualId",
                table: "Seguimientos_Ubicaciones",
                column: "SeguimientoVirtualId");

            migrationBuilder.CreateIndex(
                name: "IX_SeguimientoVirtual_UsuarioId",
                table: "SeguimientoVirtual",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Ubicaciones_EventoId",
                table: "Ubicaciones",
                column: "EventoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_Email",
                table: "Usuario",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_EventoActualId",
                table: "Usuario",
                column: "EventoActualId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_SeguimientoActualId",
                table: "Usuario",
                column: "SeguimientoActualId");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_fcmkeys_UsuarioId",
                table: "usuarios_fcmkeys",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioSuscripcion_UsuarioId",
                table: "UsuarioSuscripcion",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_evento_mensajes_Evento_EventoId",
                table: "evento_mensajes",
                column: "EventoId",
                principalTable: "Evento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventoGrupo_Evento_EventoId",
                table: "EventoGrupo",
                column: "EventoId",
                principalTable: "Evento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventoGrupo_Grupo_GrupoId",
                table: "EventoGrupo",
                column: "GrupoId",
                principalTable: "Grupo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Resoluciones_Evento_EventoId",
                table: "Resoluciones",
                column: "EventoId",
                principalTable: "Evento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Ubicaciones_Evento_EventoId",
                table: "Ubicaciones",
                column: "EventoId",
                principalTable: "Evento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuario_Evento_EventoActualId",
                table: "Usuario",
                column: "EventoActualId",
                principalTable: "Evento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuario_SeguimientoVirtual_SeguimientoActualId",
                table: "Usuario",
                column: "SeguimientoActualId",
                principalTable: "SeguimientoVirtual",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evento_Usuario_UsuarioId",
                table: "Evento");

            migrationBuilder.DropForeignKey(
                name: "FK_SeguimientoVirtual_Usuario_UsuarioId",
                table: "SeguimientoVirtual");

            migrationBuilder.DropTable(
                name: "evento_mensajes");

            migrationBuilder.DropTable(
                name: "EventoGrupo");

            migrationBuilder.DropTable(
                name: "grupos_configuraciones_configevento");

            migrationBuilder.DropTable(
                name: "grupos_mensajes");

            migrationBuilder.DropTable(
                name: "GrupoSeguimiento");

            migrationBuilder.DropTable(
                name: "GrupoUsuario");

            migrationBuilder.DropTable(
                name: "Resoluciones");

            migrationBuilder.DropTable(
                name: "Seguimientos_Rutas_Waypoints");

            migrationBuilder.DropTable(
                name: "Seguimientos_Ubicaciones");

            migrationBuilder.DropTable(
                name: "Ubicaciones");

            migrationBuilder.DropTable(
                name: "usuarios_fcmkeys");

            migrationBuilder.DropTable(
                name: "UsuarioSuscripcion");

            migrationBuilder.DropTable(
                name: "grupos_configuraciones");

            migrationBuilder.DropTable(
                name: "Seguimientos_Rutas");

            migrationBuilder.DropTable(
                name: "suscripciones");

            migrationBuilder.DropTable(
                name: "Grupo");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Evento");

            migrationBuilder.DropTable(
                name: "SeguimientoVirtual");
        }
    }
}
