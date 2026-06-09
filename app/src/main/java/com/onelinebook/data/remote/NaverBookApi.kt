package com.onelinebook.data.remote

import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Query

interface NaverBookApi {
    @GET("v1/search/book.json")
    suspend fun searchBooks(
        @Header("X-Naver-Client-Id") clientId: String,
        @Header("X-Naver-Client-Secret") clientSecret: String,
        @Query("query") query: String,
        @Query("display") display: Int = 20,
    ): NaverBookResponse
}
