package com.closely.modules.db.database;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class AuthorizationData {

    /*@PrimaryKey
    public int uid;*/

    @NonNull
    @PrimaryKey
    @ColumnInfo(name = "acces_token")
    public String accesToken;

    @ColumnInfo(name = "token_id")
    public String tokenId;

    @ColumnInfo(name = "refresh_token")
    public String refreshToken;

}
