package com.onelinebook.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface QuoteDao {

    @Query("SELECT * FROM quotes ORDER BY createdAt DESC")
    fun observeLatest(): Flow<List<Quote>>

    @Query("SELECT * FROM quotes ORDER BY isFavorite DESC, createdAt DESC")
    fun observeFavoritesFirst(): Flow<List<Quote>>

    @Query("SELECT * FROM quotes ORDER BY bookTitle COLLATE NOCASE ASC, createdAt DESC")
    fun observeByBook(): Flow<List<Quote>>

    @Query("SELECT * FROM quotes WHERE id = :id")
    fun observeById(id: Long): Flow<Quote?>

    @Query("SELECT * FROM quotes WHERE id = :id")
    suspend fun getById(id: Long): Quote?

    @Query("SELECT COUNT(*) FROM quotes")
    suspend fun count(): Int

    /** Random quote for the "오늘의 한줄" card / daily notification. */
    @Query("SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1")
    suspend fun getRandom(): Quote?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(quote: Quote): Long

    @Update
    suspend fun update(quote: Quote)

    @Delete
    suspend fun delete(quote: Quote)

    @Query("UPDATE quotes SET isFavorite = :favorite, updatedAt = :now WHERE id = :id")
    suspend fun setFavorite(id: Long, favorite: Boolean, now: Long = System.currentTimeMillis())
}
