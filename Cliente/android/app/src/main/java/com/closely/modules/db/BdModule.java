package com.closely.modules.db;

import android.util.Log;

import androidx.annotation.NonNull;

import com.closely.modules.db.database.AppDataBase;
import com.closely.modules.db.database.AuthorizationData;
import com.closely.modules.db.database.SingletonDB;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Arrays;
import java.util.List;

public class BdModule extends ReactContextBaseJavaModule {

    private ReactContext context;

    public BdModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }


    private AuthorizationData getTokenFromDB(){
        SingletonDB singletonDB = SingletonDB.getSingletonDB(context);
        AppDataBase db = singletonDB.getDb();

        List<AuthorizationData> list =  db.authorizationDataDao().getAll();
        Log.println(Log.ERROR,"Error","GET TOKEN" + list.size());

        AuthorizationData au = list.get(0);
        log("accesToken: " + au.accesToken);
        log("refreshToken: " + au.refreshToken);
        log("tokenId: "+ au.tokenId);
        //context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);

        return list.size() > 0 ?  list.get(0) : null;
    }

    private void setTokenInToDB(String accesToken, String refreshToken, String tokenId) {
        AppDataBase db  = SingletonDB.getSingletonDB(context).getDb();
        List<AuthorizationData> list = db.authorizationDataDao().getAll();

        db.authorizationDataDao().delete(list);

        AuthorizationData authorizationData = new AuthorizationData();
        authorizationData.accesToken = "Bearer " + accesToken;
        authorizationData.refreshToken = refreshToken;
        authorizationData.tokenId = tokenId;


        Log.println(Log.ERROR,"Error","Seteando TOKEN");

        db.authorizationDataDao().insertAll(authorizationData);
        getTokenFromDB();
    }

    @ReactMethod
    public void getToken(Promise promise){
        try{
            AuthorizationData authorizationData = getTokenFromDB();
            if(null == authorizationData) {
                return;
            }
            log("authorization data no es null");
            WritableArray list = Arguments.createArray();

            WritableMap params = Arguments.createMap();
            params.putString("accesToken", authorizationData.accesToken);
            params.putString("tokenId", authorizationData.tokenId);
            params.putString("refreshToken", authorizationData.refreshToken);
            //log(promise== null ? "es nullo promise": "no es nullo promise");

            list.pushMap(params);
            promise.resolve(list);
        }catch (Exception e){
            Log.println(Log.ERROR,"ERROR", Arrays.toString(e.getStackTrace()));
        }
    }

    public void log(String mensaje){
        Log.println(Log.ERROR,"ERROR", mensaje);
    }

    @ReactMethod
    public void setToken(String accessToken, String refreshToken, String tokenId, Promise promise ){
        if(promise == null) {
            Log.println(Log.ERROR, "ERROR", "La promise es null");
            return;
        };
        if(accessToken == null)promise.reject("accessToken es null", new Exception());
        if(tokenId == null) promise.reject("tokenId is null", new Exception());
        if(refreshToken == null) promise.reject("refreshToken es null", new Exception());

        setTokenInToDB(accessToken, refreshToken, tokenId);
        Log.println(Log.ERROR,"ERROR","TOKEN SAVED");
        promise.resolve("TokenSaved");
    }

    @NonNull
    @Override
    public String getName() {
        return "BdModule";
    }
}
