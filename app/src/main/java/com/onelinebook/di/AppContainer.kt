package com.onelinebook.di

import android.content.Context
import com.onelinebook.data.local.OneLineDatabase
import com.onelinebook.data.prefs.UserPreferences
import com.onelinebook.data.remote.NaverBookApi
import com.onelinebook.data.repository.BookSearchRepository
import com.onelinebook.data.repository.QuoteRepository
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

/** Tiny hand-rolled DI container — no framework needed for an app this size. */
class AppContainer(context: Context) {

    private val database = OneLineDatabase.get(context)

    val quoteRepository: QuoteRepository = QuoteRepository(database.quoteDao())

    val userPreferences: UserPreferences = UserPreferences(context)

    val bookSearchRepository: BookSearchRepository by lazy {
        val json = Json { ignoreUnknownKeys = true }
        val client = OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BASIC
            })
            .build()
        val retrofit = Retrofit.Builder()
            .baseUrl("https://openapi.naver.com/")
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
        BookSearchRepository(retrofit.create(NaverBookApi::class.java))
    }
}
