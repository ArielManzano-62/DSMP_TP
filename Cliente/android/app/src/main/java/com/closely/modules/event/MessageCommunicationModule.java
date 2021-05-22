package com.closely.modules.event;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MessageCommunicationModule extends ReactContextBaseJavaModule
        implements LifecycleEventListener {
    private String EVENTO_ID = "eventoId";
    protected Handler myHandler;

    public MessageCommunicationModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
    }

    public void messageText(String newinfo) {
        if (newinfo.compareTo("") != 0) {
            //Toast.makeText(getReactApplicationContext(),"messageText", Toast.LENGTH_SHORT).show();
        }
    }

    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {

            //Toast.makeText(context,"Recibi un mensaje del wearable", Toast.LENGTH_SHORT).show();

            String smartwatch_event = intent.getStringExtra("smartwatch_event");
            if(smartwatch_event == null || "".equals(smartwatch_event))return;

            WritableMap params = Arguments.createMap();
            params.putString(EVENTO_ID, smartwatch_event);

            sendEvent(getReactApplicationContext(), "increaseCounter", params);
        }
    }

    private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }



    @Override
    public void onHostResume() {
        myHandler = new Handler(msg -> {
            Bundle stuff = msg.getData();
            messageText(stuff.getString("messageText"));
            return true;
        });

        IntentFilter messageFilter = new IntentFilter(Intent.ACTION_SEND);
        Receiver messageReceiver = new Receiver();
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(messageReceiver, messageFilter);
    }

    @Override
    public void onHostPause() {}

    @Override
    public void onHostDestroy() {}

    @NonNull
    @Override
    public String getName() {
        return "AndroidWearCommunication";
    }
}

