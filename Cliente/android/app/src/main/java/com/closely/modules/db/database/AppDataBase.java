package com.closely.modules.db.database;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = {AuthorizationData.class}, version = 1)
public abstract class AppDataBase extends RoomDatabase {
    public abstract AuthorizationDataDao authorizationDataDao();
}
