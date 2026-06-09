package com.onelinebook.data.repository

import com.onelinebook.data.local.Quote
import com.onelinebook.data.local.QuoteDao
import kotlinx.coroutines.flow.Flow

class QuoteRepository(private val dao: QuoteDao) {

    fun observeQuotes(sortOrder: SortOrder): Flow<List<Quote>> = when (sortOrder) {
        SortOrder.LATEST -> dao.observeLatest()
        SortOrder.FAVORITE -> dao.observeFavoritesFirst()
        SortOrder.BOOK -> dao.observeByBook()
    }

    fun observeQuote(id: Long): Flow<Quote?> = dao.observeById(id)

    suspend fun getQuote(id: Long): Quote? = dao.getById(id)

    suspend fun count(): Int = dao.count()

    suspend fun getRandom(): Quote? = dao.getRandom()

    suspend fun save(quote: Quote): Long {
        val now = System.currentTimeMillis()
        return if (quote.id == 0L) {
            dao.insert(quote.copy(createdAt = now, updatedAt = now))
        } else {
            dao.update(quote.copy(updatedAt = now))
            quote.id
        }
    }

    suspend fun delete(quote: Quote) = dao.delete(quote)

    suspend fun toggleFavorite(quote: Quote) =
        dao.setFavorite(quote.id, !quote.isFavorite)
}
