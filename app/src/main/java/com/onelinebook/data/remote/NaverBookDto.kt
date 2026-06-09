package com.onelinebook.data.remote

import kotlinx.serialization.Serializable

@Serializable
data class NaverBookResponse(
    val total: Int = 0,
    val items: List<NaverBookItem> = emptyList(),
)

@Serializable
data class NaverBookItem(
    val title: String = "",
    val link: String = "",
    val image: String = "",
    val author: String = "",
    val publisher: String = "",
    val pubdate: String = "",
    val isbn: String = "",
    val description: String = "",
)
