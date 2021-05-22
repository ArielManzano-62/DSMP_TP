package com.closely.modules.event;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.closely.MainActivity;
import com.closely.service.EventoService;
import com.closely.service.MessageService;
import com.closely.utilities.SendLocationToActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.greenrobot.eventbus.EventBus;


/*
* EventComunicationModule tiene el objetivo de enviar el evento y de conectar el websocket
* */
public class EventCommunicationModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private EventoService eventoService;
    private Boolean mBound = false;
    private ReactContext context;
    private String EVENTO_ID = "eventoId";
    private String UPDATE_LOCATION = "update_location";
    private MessageService messageService;
    private Receiver receiver;

    public EventCommunicationModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        Intent intent = new Intent(context, EventoService.class);
        context.bindService(intent, connection, Context.BIND_AUTO_CREATE);
        IntentFilter messageFilter = new IntentFilter(Intent.ACTION_SEND);
        receiver = new Receiver();
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(receiver, messageFilter);
        EventBus.getDefault().register(this);
    }

    @Override
    public void onHostResume() {}
    @Override
    public void onHostPause() {}
    @Override
    public void onHostDestroy() {}

    @ReactMethod
    public void newEvent(String tipoEvento){
        Log.println(Log.ERROR,"ERROR", "EL TIPO DE EVENTO ES: " + tipoEvento);

        sendEvent(tipoEvento);
    }
    @ReactMethod
    public void connectWithEvent(String eventoId){
        if(eventoId == null) return;
        Log.println(Log.ERROR,"ERROR", "Reanudando Conexion");
        Log.println(Log.ERROR,"ERROR", "eventoId vamos a ver q es" + eventoId);
        eventoService.openWebSocket(eventoId);
        intentGetLocation();
    }

    @ReactMethod
    public void connectionStop(){
        Log.println(Log.ERROR,"ERROR", "Connection Stop");
        if (eventoService != null) eventoService.closeWebSocket();
        intentStopLocation();
    }

    private void sendEvent(String tipoEvento){
        eventoService.sendEvento(tipoEvento);
    }

    private void notifyIdEvent(String eventoId){
        WritableMap params = Arguments.createMap();
        params.putString(EVENTO_ID, eventoId);
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENTO_ID, params);
    }

    private void intentGetLocation(){
        MainActivity.requestUpdateLocation();
    }

    private void intentStopLocation(){
        Log.println(Log.ERROR,"ERROR", "Removiendo updates de locacion");

        MainActivity.removeLocationUpdates();
    }

    @Subscribe(sticky = true, threadMode = ThreadMode.MAIN)
    public void onListenLocation(SendLocationToActivity event){
        if(event != null){
            String data = event.getLocation().getLatitude() +
                    " " +
                    event.getLocation().getLongitude();
            //Log.println(Log.ERROR,"ERROR", event.getLocation().toString());
            updateLocationEnJS(event);
        }
    }

    private void updateLocationEnJS(SendLocationToActivity locacion){
        WritableMap params = Arguments.createMap();
        params.putDouble("latitude", locacion.getLocation().getLatitude());
        params.putDouble("longitude", locacion.getLocation().getLongitude());
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(UPDATE_LOCATION, params);
    }

    private ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            EventoService.LocalBinder binder = (EventoService.LocalBinder) service;
            eventoService = binder.getService();
            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            Log.println(Log.ERROR,"ERROR", "SERVICIO DESCONECTADO");
            mBound = false;
        }
    };

    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            //Toast.makeText(context,"Recibi un mensaje del wearable", Toast.LENGTH_SHORT).show();
            String id = intent.getStringExtra("id");
            String evento = intent.getStringExtra("evento");
            if(evento == null || evento == "")return;
            notifyIdEvent(evento);
            connectWithEvent(id);
            //TODO:
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "EventoModule";
    }
}
