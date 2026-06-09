package com.onelinebook.data.remote

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/** Clean domain model surfaced to the UI from a book search. */
@Parcelize
data class BookResult(
    val title: String,
    val author: String,
    val coverUrl: String,
    val publisher: String,
) : Parcelable
