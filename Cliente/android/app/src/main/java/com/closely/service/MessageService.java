package com.closely.service;

import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

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
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MessageService extends WearableListenerService {

    private static String BASE_URL = "http://www.4closely.com";
    private static String API_EVENTOS = "/api/eventos";
    private static String API_FIN_EVENTO = "/finalizar";
    private static String API_RESOLVER_EVENTO = "/resolver";
    private static String apiOauth = "/oauth/token";
    private static String API_SUSCRIPCION = "/api/suscripciones";
    private static String API_CODIGO_SEGURIDAD = "/api/usuarios/codigo-seguridad";
    private static String API_USUARIOS = "/api/usuarios";

    private RequestQueue request;
    AuthorizationData authorizationData;
    private String tipoEvento = "Asalto";

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        //Toast.makeText(this,"Smartwatch Event", Toast.LENGTH_SHORT).show();

        authorizationData =  getToken();
        if (messageEvent.getPath().equals("/my_path")) {
            sendEvent();
        }
        else {
            super.onMessageReceived(messageEvent);
        }
    }
    /*private void setToken(){
        AppDataBase db  = SingletonDB.getSingletonDB(this).getDb();
        List<AuthorizationData> list = db.authorizationDataDao().getAll();

        db.authorizationDataDao().delete(list);

        AuthorizationData authorizationData = new AuthorizationData();
        authorizationData.accesToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFqTTNSVVE0Tnpjek5FTkNSVEUxUXpJMU1UWTJSakZHUkRRME5VUXpSRGd3UWpnelJEUkNSUSJ9.eyJpc3MiOiJodHRwczovL2Nsb3NlbHkuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA2MzAzMTI2MTY5ODU2Mjk5NzQ2IiwiYXVkIjpbImh0dHBzOi8vd3d3LmNsb3NlbHkuY29tIiwiaHR0cHM6Ly9jbG9zZWx5LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE1ODU4MjgwODUsImV4cCI6MTU4NTkxNDQ4NSwiYXpwIjoienc0TFFlSUlBZ3o3TWFZRHpPUHRXU2EwRVRuaU5aaXkiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.R20sPHeR4350HzMgMJXSN9jGXIZnFRLWwfTipA0KMflZ8CUUFoJVV2I64YPRzUguBxG1UWzlR1LWw_n6iLA_BWnHdcPBlPjm52GYtDpp9hb4cI_IZM_BZVDZ_k0PxcmlzFLKTAIvvUuczs0PDpd_MS1eTHKOFNiOyDKb8VTqg_WBF045JnS_RfgFNTag9O3gFm_m3KeIh0sqxQLQyvefk9U7h4tEIAPcPBjYPJgz3HetpS1_uhSAO3q_slQ0_PML1SYDPBnE9WvKs2gz-L5B9d_4PWyBRg6TNZcrf5Eiuj8pZ29aXo5l8pvNbGAYF5tLnIYfvthMabg6qoruAAMinw";

        authorizationData.refreshToken = "asfsffasdfsadf";
        authorizationData.tokenId = "asfasdfsdf";


        Log.println(Log.ERROR,"Error","Seteando TOKEN");

        db.authorizationDataDao().insertAll(authorizationData);
    }*/
    private AuthorizationData getToken(){
        SingletonDB singletonDB = SingletonDB.getSingletonDB(this);
        AppDataBase db = singletonDB.getDb();

        List<AuthorizationData> list =  db.authorizationDataDao().getAll();
        Log.println(Log.ERROR,"Error","GET TOKEN" + list.size());


        return list.size() > 0 ?  list.get(0) : null;
    }

    private void sendEvent(){
        if(null == authorizationData)return;
        request = Volley.newRequestQueue(this);
        estaSuscripto();
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
                Log.println(Log.ERROR,"ERROR", eventoId);
                JSONObject resp = response1;
                Log.println(Log.ERROR, "ERROR", resp.toString());
                sendIdEvent(eventoId, resp);
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



    private void sendIdEvent(String id, JSONObject evento){
        Intent messageIntent = new Intent();
        messageIntent.setAction(Intent.ACTION_SEND);
        messageIntent.putExtra("id",id);
        messageIntent.putExtra("smartwatch_event",evento.toString());
        LocalBroadcastManager.getInstance(this).sendBroadcast(messageIntent);
    }

}

