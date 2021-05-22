using AutoMapper;
using LogicaNegocio;
using LogicaNegocio.Adapters.AmazonAdapter;
using LogicaNegocio.Adapters.Auth0Adapter;
using LogicaNegocio.Adapters.PayPalAdapter;
using LogicaNegocio.Estadisticas.MapaCalor;
using LogicaNegocio.Eventos.ActualizarUbicacionEvento;
using LogicaNegocio.Eventos.ConsultarEvento;
using LogicaNegocio.Eventos.ConsultarEventosActivos;
using LogicaNegocio.Eventos.FinalizarEvento;
using LogicaNegocio.Eventos.NuevoEvento;
using LogicaNegocio.Eventos.NuevoMensaje;
using LogicaNegocio.Eventos.ResolverEvento;
using LogicaNegocio.Grupos.AbandonarGrupo;
using LogicaNegocio.Grupos.AgregarIntegrantes;
using LogicaNegocio.Grupos.CambiarFoto;
using LogicaNegocio.Grupos.ConfigurarEventosGrupo;
using LogicaNegocio.Grupos.ConfigurarEventosGrupo.ConsultarConfiguracion;
using LogicaNegocio.Grupos.CrearGrupo;
using LogicaNegocio.Grupos.EliminarIntegrante;
using LogicaNegocio.Grupos.ObtenerGrupo;
using LogicaNegocio.Grupos.ObtenerGrupos;
using LogicaNegocio.Grupos.RegistrarMensaje;
using LogicaNegocio.Historiales.Eventos.HistorialGrupo;
using LogicaNegocio.Historiales.Eventos.HistorialPropio;
using LogicaNegocio.Historiales.Seguimientos.HistorialGrupo;
using LogicaNegocio.Historiales.Seguimientos.HistorialPropio;
using LogicaNegocio.Mapper;
using LogicaNegocio.Notificaciones.DesuscribirFcmKey;
using LogicaNegocio.Notificaciones.Notificador;
using LogicaNegocio.Notificaciones.SuscribirFcmKey;
using LogicaNegocio.Repositorio;
using LogicaNegocio.Seguimientos.ActualizarUbicacion;
using LogicaNegocio.Seguimientos.Consultar;
using LogicaNegocio.Seguimientos.ConsultarSeguimiento;
using LogicaNegocio.Seguimientos.FinalizarSeguimiento;
using LogicaNegocio.Seguimientos.NuevoSeguimiento;
using LogicaNegocio.Usuarios.AnalizarWebhook;
using LogicaNegocio.Usuarios.AprobarSuscripcion;
using LogicaNegocio.Usuarios.CambiarFotoPerfil;
using LogicaNegocio.Usuarios.CancelarSuscripcion;
using LogicaNegocio.Usuarios.CodigoSeguridad.ActualizarCodigo;
using LogicaNegocio.Usuarios.CodigoSeguridad.ConsultarCodigo;
using LogicaNegocio.Usuarios.ConsultarEstado;
using LogicaNegocio.Usuarios.ConsultarEstadoSuscripcion;
using LogicaNegocio.Usuarios.ConsultarPorMail;
using LogicaNegocio.Usuarios.Crear;
using LogicaNegocio.Usuarios.ModificarDatos;
using LogicaNegocio.Usuarios.Registrar;
using LogicaNegocio.Usuarios.Suscribir;
using LogicaNegocio.WebSockets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Respositorio;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace Closely
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("MySQLConnection");


            services.AddCors();
            services.AddNodeServices();

            services.AddDbContext<DataContext>(options => options.UseMySql(connectionString, b => b.MigrationsAssembly("Closely")));
            //services.AddDbContext<DataContext>(options => options.UseMySql("server=localhost;port=3306;database=closely;user=root;password=root", b => b.MigrationsAssembly("Closely")));
            services.AddTransient<INuevoEventoInteractor, NuevoEventoInteractor>();
            services.AddTransient<IConsultarEventoInteractor, ConsultarEventoInteractor>();
            services.AddTransient<IFinalizarEventoInteractor, FinalizarEventoInteractor>();
            services.AddTransient<IResolverEventoInteractor, ResolverEventoInteractor>();
            services.AddTransient<IConsultarEstadoUsuarioInteractor, ConsultarEstadoUsuarioInteractor>();
            services.AddTransient<IConsultarEventosActivosInteractor, ConsultarEventosActivosInteractor>();
            services.AddTransient<IActualizarUbicacionEventoInteractor, ActualizarUbicacionEventoInteractor>();
            services.AddTransient<ICrearGrupoInteractor, CrearGrupoInteractor>();
            services.AddTransient<IRegistrarUsuarioInteractor, RegistrarUsuarioInteractor>();
            services.AddTransient<IAbandonarGrupoInteractor, AbandonarGrupoInteractor>();
            services.AddTransient<IModificarDatosUsuarioInteractor, ModificarDatosUsuarioInteractor>();
            services.AddTransient<IObtenerHistorialEventosPropioInteractor, ObtenerHistorialEventosPropioInteractor>();
            services.AddTransient<IObtenerHistorialEventosGrupoInteractor, ObtenerHistorialEventosGrupoInteractor>();
            services.AddTransient<IConfigurarEventosGrupoInteractor, ConfigurarEventosGrupoInteractor>();
            services.AddTransient<IConsultarConfiguracionGrupoInteractor, ConsultarConfiguracionGrupoInteractor>();
            services.AddTransient<IRegistrarMensajeInteractor, RegistrarMensajeInteractor>();
            services.AddTransient<IConsultarUsuarioPorMailInteractor, ConsultarUsuarioPorMailInteractor>();
            services.AddTransient<IObtenerGruposInteractor, ObtenerGruposInteractor>();
            services.AddTransient<IObtenerGrupoInteractor, ObtenerGrupoInteractor>();
            services.AddTransient<IIdentityProvider, AuthAdapter>();
            services.AddTransient<ICambiarFotoPerfilInteractor, CambiarFotoPerfilInteractor>();
            services.AddTransient<IImageUploader, AmazonAdapter>();
            services.AddTransient<ICrearUsuarioInteractor, CrearUsuarioInteractor>();
            services.AddTransient<ISuscribirFcmKeyInteractor, SuscribirFcmKeyInteractor>();
            services.AddTransient<IDesuscribirFcmKeyInteractor, DesuscribirFcmKeyInteractor>();
            services.AddTransient<INotificatorInteractor, NotificatorInteractor>();
            services.AddTransient<ISubscriptionService, PayPalAdapter>();
            services.AddTransient<ISuscripcionUsuarioInteractor, SuscripcionUsuarioInteractor>();
            services.AddTransient<IAprobarSuscripcionInteractor, AprobarSuscripcionInteractor>();
            services.AddTransient<IConsultarSuscripcionActivaInteractor, ConsultarSuscripcionActivaInteractor>();
            services.AddTransient<IObtenerPuntosDeEventosInteractor, ObtenerPuntosDeEventosInteractor>();
            services.AddTransient<IConsultarCodigoSeguridadInteractor, ConsultarCodigoSeguridadInteractor>();
            services.AddTransient<IActualizarCodigoSeguridadInteractor, ActualizarCodigoSeguridadInteractor>();
            services.AddTransient<INuevoMensajeEventoInteractor, NuevoMensajeEventoInteractor>();
            services.AddTransient<ICancelarSuscripcionInteractor, CancelarSuscripcionInteractor>();
            services.AddTransient<IAnalizarWebhookInteractor, AnalizarWebhookInteractor>();
            services.AddTransient<IConsultarSeguimientosActivosInteractor, ConsultarSeguimientosActivosInteractor>();
            services.AddTransient<INuevoSeguimientoInteractor, NuevoSeguimientoInteractor>();
            services.AddTransient<IActualizarUbicacionSeguimientoInteractor, ActualizarUbicacionSeguimientoInteractor>();
            services.AddTransient<IConsultarSeguimientoInteractor, ConsultarSeguimientoInteractor>();
            services.AddTransient<IFinalizarSeguimientoInteractor, FinalizarSeguimientoInteractor>();
            services.AddTransient<IAgregarIntegrantesInteractor, AgregarIntegrantesInteractor>();
            services.AddTransient<ICambiarFotoGrupoInteractor, CambiarFotoGrupoInteractor>();
            services.AddTransient<IEliminarIntegranteInteractor, EliminarIntegranteInteractor>();
            services.AddTransient<IObtenerHistorialSeguimientosPropioInteractor, ObtenerHistorialSeguimientosPropioInteractor>();
            services.AddTransient<IObtenerHistorialSeguimientosGrupoInteractor, ObtenerHistorialSeguimientosGrupoInteractor>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddAutoMapper(Assembly.GetAssembly(typeof(GrupoProfile)));
            services.AddSignalR();


            services.AddMvcCore()
                .AddAuthorization()
                .AddJsonFormatters()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.Authority = "http://closely.auth0.com";
                    options.RequireHttpsMetadata = false;

                    options.Audience = "https://www.closely.com";
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            if (!string.IsNullOrEmpty(accessToken))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders =
                    ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed((host) => true)
                .AllowCredentials()
            );

            app.UseHttpsRedirection();
            app.UseHsts();


            app.UseStaticFiles();

            app.UseAuthentication();



            app.UseSignalR(routes =>
            {
                routes.MapHub<EventoHub>("/eventoHub");
                routes.MapHub<GrupoHub>("/gruposHub");
                routes.MapHub<SeguimientoHub>("/seguimientoHub");
            });
            app.UseMvc();
        }
    }
}
