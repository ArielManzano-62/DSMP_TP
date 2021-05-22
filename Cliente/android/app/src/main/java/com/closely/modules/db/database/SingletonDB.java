package com.closely.modules.db.database;

import android.content.Context;

import androidx.room.Room;

public class SingletonDB {
    private Context context;
    private static SingletonDB singletonDB;
    private AppDataBase db;
    private static final String nombreDB = "Credenciales";

    private SingletonDB(Context context){
        this.context = context;
        db = Room.databaseBuilder(context, AppDataBase.class, nombreDB).allowMainThreadQueries().build();
    }

    public static SingletonDB getSingletonDB(Context context) {
        if(singletonDB == null){
            singletonDB = new SingletonDB(context);
        }
        return singletonDB;
    }

    public synchronized  AppDataBase getDb(){
        return db;
    };
}
