package com.closely.utilities;

import android.util.Log;

import com.microsoft.signalr.HubConnection;
import com.microsoft.signalr.HubConnectionBuilder;
import com.microsoft.signalr.HubConnectionState;

public class WebSocket {
    private String url = "http://www.4closely.com/eventoHub";
    private String eventoId;

    private HubConnection connection;

    private WebSocket(String eventoId){
        connection = HubConnectionBuilder.create(url).build();
        this.eventoId = eventoId;
    }

    public static WebSocket getWebSocket(String eventoId){
        Log.println(Log.ERROR, "error","creando nuevo websocket");
            return new WebSocket(eventoId);
    }

    public void build(){
        if(connection == null) return;

        this.connection.onClosed((x) -> {
            logcat("SE DESCONECTO");
            reconnect();

        });

        connection.start().blockingAwait();
        sendSubscribe();
    }

    private void reconnect() {
        logcat("Reconectando...");
        this.connection.start().blockingAwait();
        logcat("Resultado de reconexion: " + this.connection.getConnectionState());
        if (this.connection.getConnectionState() != HubConnectionState.DISCONNECTED) {
            this.connection.send("Subscribe", eventoId);
            return;
        }
        reconnect();


    }

    private void newMessage(){
        connection.on("NuevoMensaje", this::logcat, String.class);
    }

    public void updateLocation(Locacion location, int count){
        connection.send("UpdateLocation", eventoId, location);
    }

    private void sendSubscribe(){

        logcat("{ \"eventoId\" : \"" + eventoId + "\"}");
        connection.send("Subscribe", eventoId);

        //updateLocation(40.7142715, -74.0059662);
    }

    public void stopWebSocket(){
        if(connection == null || HubConnectionState.DISCONNECTED == connection.getConnectionState()) return;
        Log.println(Log.ERROR,"ERROR", "Desconectando");
        unSubscribe();
        stop();
    }

    private void unSubscribe(){
        connection.send("Unsubscribe", eventoId);
    }

    private void stop(){
        if(connection != null) connection.stop();
    }

    private void logcat(String mensaje){
        Log.println(Log.ERROR,"ERROR",mensaje);
    }
}
