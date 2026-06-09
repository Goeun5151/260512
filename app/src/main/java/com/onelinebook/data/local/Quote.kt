package com.onelinebook.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/** A single line captured from a book. */
@Entity(tableName = "quotes")
data class Quote(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val text: String,
    val bookTitle: String = "",
    val author: String = "",
    val page: Int? = null,
    val note: String = "",
    val coverUrl: String = "",
    val isFavorite: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
)
