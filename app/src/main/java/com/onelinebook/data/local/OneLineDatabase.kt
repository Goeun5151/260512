package com.onelinebook.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [Quote::class], version = 1, exportSchema = false)
abstract class OneLineDatabase : RoomDatabase() {
    abstract fun quoteDao(): QuoteDao

    companion object {
        @Volatile
        private var INSTANCE: OneLineDatabase? = null

        fun get(context: Context): OneLineDatabase =
            INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    OneLineDatabase::class.java,
                    "onelinebook.db",
                ).fallbackToDestructiveMigration().build().also { INSTANCE = it }
            }
    }
}
