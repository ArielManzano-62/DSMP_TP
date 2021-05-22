package com.closely.service;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.closely.modules.db.database.AppDataBase;
import com.closely.modules.db.database.AuthorizationData;
import com.closely.modules.db.database.SingletonDB;
import com.closely.utilities.Locacion;
import com.closely.utilities.SendLocationToActivity;
import com.closely.utilities.WebSocket;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EventoService extends Service{

    private final IBinder binder = new LocalBinder();

    private Boolean enEvento = false;

    private static String BASE_URL = "http://www.4closely.com";
    private static String API_EVENTOS = "/api/eventos";
    private static String API_FIN_EVENTO = "/finalizar";
    private static String API_RESOLVER_EVENTO = "/resolver";
    private static String apiOauth = "/oauth/token";
    private static String API_SUSCRIPCION = "/api/suscripciones";
    private static String API_CODIGO_SEGURIDAD = "/api/usuarios/codigo-seguridad";
    private static String API_USUARIOS = "/api/usuarios";

    private RequestQueue request;
    private AuthorizationData authorizationData;
    private WebSocket webSocket;
    private String tipoEvento = "Asalto";
    private boolean flag = false;

    public class LocalBinder extends Binder {
        public EventoService getService() {
            // Return this instance of LocalService so clients can call public methods
            return EventoService.this;
        }
    }

    public void sendEvento(String tipoEvento){
        subscribirseLocacion();
        Log.println(Log.ERROR,"ERROR","Estoy en send Evento de eventoService: " + tipoEvento);

        if(!tipoEvento.equals(""))this.tipoEvento = tipoEvento;
        if(enEvento)return;

        Log.println(Log.ERROR,"ERROR","TIPO EVENTO A ENVIAR: " + tipoEvento);

        authorizationData = getToken();

        if(authorizationData == null) return;
        enviarEvento();
    }

    private AuthorizationData getToken(){
        SingletonDB singletonDB = SingletonDB.getSingletonDB(this);
        AppDataBase db = singletonDB.getDb();

        List<AuthorizationData> list =  db.authorizationDataDao().getAll();
        Log.println(Log.ERROR,"Error","GET TOKEN" + list.size());


        return list.size() > 0 ?  list.get(0) : null;
    }

    private void enviarEvento(){
        if(null == authorizationData)return;
        request = Volley.newRequestQueue(this);
        startEvent();
        //estaSuscripto();
    }

    private void send(JSONObject jsonObject, String BASE_URL, Response.Listener<JSONObject> onResponse, Response.ErrorListener errorListener){
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                null != jsonObject ? Request.Method.POST : Request.Method.GET, BASE_URL, jsonObject, onResponse, errorListener){
            @Override
            public Map<String, String> getHeaders() {
                HashMap<String, String> params = new HashMap<String, String>();
                params.put("Authorization", authorizationData.accesToken);
                params.put("Accept", "application/json");
                return params;
            }

            @Override
            protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
                try {
                    String jsonString = new String(response.data,
                            HttpHeaderParser.parseCharset(response.headers, PROTOCOL_CHARSET));

                    JSONObject result = null;

                    if (jsonString != null && jsonString.length() > 0)
                        result = new JSONObject(jsonString);

                    return Response.success(result,
                            HttpHeaderParser.parseCacheHeaders(response));
                } catch (UnsupportedEncodingException e) {
                    return Response.error(new ParseError(e));
                } catch (JSONException je) {
                    return Response.error(new ParseError(je));
                }
                //return super.parseNetworkResponse(response);
            }
        };
        request.add(jsonObjectRequest);
    }

    private void estaSuscripto(){
        //Log.println(Log.ERROR,"ERROR", authorizationData.accesToken);
        Response.Listener<JSONObject> onResponse = response1 -> {
            Log.println(Log.ERROR, "ERROR", "ESTA SUSCRIPTO");
            estaEnCodigoSeguridad();
        };

        Response.ErrorListener errorListener = error -> {
            Log.println(Log.ERROR, "ERROR","NO ESTA SUSCRIPTO");
            Log.println(Log.ERROR, "ERROR", error.toString());
        };
        send(null, BASE_URL + API_SUSCRIPCION, onResponse, errorListener);
    }

    private void estaEnCodigoSeguridad(){
        Response.Listener<JSONObject> onResponse = response1 -> {
            Log.println(Log.ERROR, "ERROR", "TIene codigo de seguridad");
            estaEnEvento();
        };

        Response.ErrorListener errorListener = error -> {
            Log.println(Log.ERROR, "ERROR","NO TIENE CODIGO DE SEGURIDAD error");
            Log.println(Log.ERROR, "ERROR", error.toString());
        };
        send(null, BASE_URL + API_CODIGO_SEGURIDAD, onResponse, errorListener);
    }

    private void estaEnEvento(){
        Response.Listener<JSONObject> onResponse = response1 -> {
            Log.println(Log.ERROR, "ERROR", "TIene codigo de seguridad");
            try {
                String estado = response1.getString("usuarioEstado");
                Log.println(Log.ERROR,"ERROR", estado);
                if(estado == "EnEmergencia"){
                    Log.println(Log.ERROR,"ERROR","Se encuentra en evento de emergencia");
                } else {
                    startEvent();
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        };

        Response.ErrorListener errorListener = error -> {
            Log.println(Log.ERROR, "ERROR","NO TIENE CODIGO DE SEGURIDAD error");
            Log.println(Log.ERROR, "ERROR", error.toString());
        };
        send(null, BASE_URL + API_USUARIOS, onResponse, errorListener);
    }

    public void startEvent(){
        JSONObject jsonObject = null;
        try{
            jsonObject = new JSONObject();
            jsonObject.put("tipoEvento",this.tipoEvento);
        } catch (Exception e){
            e.printStackTrace();
        }
        Response.Listener<JSONObject> onResponse = response1 -> {
            try {
                Log.println(Log.ERROR, "ERROR", response1.toString());

                String eventoId = response1.getString("eventoId");
                JSONObject resp = response1;
                Log.println(Log.ERROR, "ERROR", resp.toString());
                notificarEstadoEvento(eventoId, resp);

            } catch (Exception e) {
                Log.println(Log.ERROR, "ERROR", e.toString());
            }
        };

        Response.ErrorListener errorListener = error -> {
            Log.println(Log.ERROR, "ERROR","ESTOY EN EL ON ERROR RESPONSE DEL SEND EVENT");
            Log.println(Log.ERROR, "ERROR", error.toString());
        };
        send(jsonObject, BASE_URL + API_EVENTOS, onResponse, errorListener);
    }

    private void notificarEstadoEvento(String eventoId, JSONObject resp){
        Intent messageIntent = new Intent();
        messageIntent.setAction(Intent.ACTION_SEND);
        String message = "EnEvento";
        messageIntent.putExtra("id", eventoId);
        messageIntent.putExtra("evento", resp.toString());
        LocalBroadcastManager.getInstance(this).sendBroadcast(messageIntent);
    }

    public void openWebSocket(String eventoId){
        subscribirseLocacion();
        webSocket = WebSocket.getWebSocket(eventoId);
        webSocket.build();
    }

    public void closeWebSocket(){
        Log.println(Log.ERROR,"ERROR", "Cerrando websocket");
        if(webSocket != null) webSocket.stopWebSocket();
        desubscribirseLocacion();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    private void subscribirseLocacion(){
        if(flag)return;
        EventBus.getDefault().register(this);
        flag = true;
    }

    private void desubscribirseLocacion(){
        if(flag)return;
        EventBus.getDefault().unregister(this);
        flag = false;
    }

    @Subscribe(sticky = true, threadMode = ThreadMode.MAIN)
    public void onListenLocation(SendLocationToActivity event){
        if(event != null){
            String data = event.getLocation().getLatitude() +
                    " / " +
                    event.getLocation().getLongitude();
            Log.println(Log.ERROR,"ERROR",data + "La locacion es estoooo");
            Locacion locacion = new Locacion(event.getLocation().getLatitude(), event.getLocation().getLongitude());
            updateWebSocketLocation(locacion);
        }
    }

    private void updateWebSocketLocation(Locacion event){
        Log.println(Log.ERROR,"ERROR",webSocket == null ? "Websocket no se inicio" : "Websocket iniciado");

        if(webSocket == null){
            return;
        }
        webSocket.updateLocation(event, 0);
    }

}
