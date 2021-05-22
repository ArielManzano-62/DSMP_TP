package com.closely.modules.db.database;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;

import java.util.List;

@Dao
public interface AuthorizationDataDao {

    @Query("SELECT * FROM AuthorizationData")
    List<AuthorizationData> getAll();

    @Insert
    void insertAll(AuthorizationData... authorizationData);

    @Delete
    void delete(AuthorizationData... authorizationData);

    @Delete
    void delete(List<AuthorizationData> authorizationData);
}
