package com.closely;

import android.Manifest;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.util.Log;

import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

import com.closely.service.MyBackGroundService;
import com.facebook.react.ReactActivity;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity implements SharedPreferences.OnSharedPreferenceChangeListener{

  private static final String KEY_REQUESTING_LOCATION_UPDATES = "LocationUpdateEnable";

  static MyBackGroundService mservice = null;
  boolean mBound = false;

  private ServiceConnection mserServiceConnection = new ServiceConnection() {
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
      MyBackGroundService.LocalBinder binder = (MyBackGroundService.LocalBinder) service;
      mservice = binder.getService();
      mBound = true;

    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
      mservice = null;
      mBound = false;
    }
  };

  @Override
  protected void onStart() {
    super.onStart();
    bindService(new Intent(MainActivity.this, MyBackGroundService.class), mserServiceConnection, Context.BIND_AUTO_CREATE);
  }

  @Override
  protected void onStop() {
    if(mBound){
      unbindService(mserServiceConnection);
      mBound = false;
    }
    PreferenceManager.getDefaultSharedPreferences(this)
            .unregisterOnSharedPreferenceChangeListener(this);
    //EventBus.getDefault().unregister(this);
    super.onStop();
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(savedInstanceState);


  }

  @Override
  public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
    if(key.equals(KEY_REQUESTING_LOCATION_UPDATES)){
      setButtonState(sharedPreferences.getBoolean(KEY_REQUESTING_LOCATION_UPDATES, false));
    }
  }

  public void setButtonState(boolean isRequestEnable){
    //TODO aca va lo que pasa cuando el estado de la locacion esta apagada o prendida
  }

  public static void requestUpdateLocation(){
    Log.println(Log.ERROR,"ERROR",mservice != null ? "mservice NO es null mainactivity":"mservice SI es null mainactivity");

    if(mservice == null) return;
    Log.println(Log.ERROR,"ERROR","Encendiendo updateLocation");
    mservice.requestLocationUpdates();
  }

  public static void removeLocationUpdates(){
    if(mservice == null) return;
    Log.println(Log.ERROR,"ERROR","Apagando updateLocation");
    mservice.removeLocationUpdates();
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "closely";
  }


}
