package com.onelinebook.data.repository

import android.text.Html
import com.onelinebook.BuildConfig
import com.onelinebook.data.remote.BookResult
import com.onelinebook.data.remote.NaverBookApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/** Result of a book search, distinguishing "no API key" from genuine outcomes. */
sealed interface BookSearchState {
    data object MissingApiKey : BookSearchState
    data class Success(val results: List<BookResult>) : BookSearchState
    data class Error(val message: String) : BookSearchState
}

class BookSearchRepository(
    private val api: NaverBookApi,
    private val clientId: String = BuildConfig.NAVER_CLIENT_ID,
    private val clientSecret: String = BuildConfig.NAVER_CLIENT_SECRET,
) {
    val hasApiKey: Boolean get() = clientId.isNotBlank() && clientSecret.isNotBlank()

    suspend fun search(query: String): BookSearchState = withContext(Dispatchers.IO) {
        if (!hasApiKey) return@withContext BookSearchState.MissingApiKey
        if (query.isBlank()) return@withContext BookSearchState.Success(emptyList())
        try {
            val response = api.searchBooks(clientId, clientSecret, query.trim())
            val results = response.items.map { item ->
                BookResult(
                    title = item.title.cleanHtml(),
                    author = item.author.cleanHtml().replace("^", ", "),
                    coverUrl = item.image,
                    publisher = item.publisher.cleanHtml(),
                )
            }
            BookSearchState.Success(results)
        } catch (e: Exception) {
            BookSearchState.Error(e.message ?: "검색 중 오류가 발생했어요")
        }
    }

    private fun String.cleanHtml(): String =
        Html.fromHtml(this, Html.FROM_HTML_MODE_LEGACY).toString().trim()
}
