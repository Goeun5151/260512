package com.onelinebook.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.onelinebook.data.local.Quote
import com.onelinebook.data.prefs.UserPreferences
import com.onelinebook.data.repository.QuoteRepository
import com.onelinebook.data.repository.SortOrder
import com.onelinebook.ui.theme.ThemeMode
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class HomeUiState(
    val quotes: List<Quote> = emptyList(),
    val today: Quote? = null,
    val sortOrder: SortOrder = SortOrder.LATEST,
    val query: String = "",
    val loading: Boolean = true,
)

@OptIn(ExperimentalCoroutinesApi::class)
class HomeViewModel(
    private val repository: QuoteRepository,
    userPreferences: UserPreferences,
) : ViewModel() {

    private val sortOrder = MutableStateFlow(SortOrder.LATEST)
    private val query = MutableStateFlow("")
    private val today = MutableStateFlow<Quote?>(null)

    val themeMode: StateFlow<ThemeMode> = userPreferences.settings
        .map { it.themeMode }
        .stateIn(viewModelScope, SharingStarted.Eagerly, ThemeMode.SYSTEM)

    val uiState: StateFlow<HomeUiState> = combine(
        sortOrder.flatMapLatest { repository.observeQuotes(it) },
        sortOrder,
        query,
        today,
    ) { quotes, order, q, todayQuote ->
        val filtered = if (q.isBlank()) quotes else quotes.filter { it.matches(q) }
        HomeUiState(
            quotes = filtered,
            today = todayQuote,
            sortOrder = order,
            query = q,
            loading = false,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), HomeUiState())

    init {
        refreshToday()
    }

    fun setSortOrder(order: SortOrder) {
        sortOrder.value = order
    }

    fun setQuery(value: String) {
        query.value = value
    }

    fun refreshToday() {
        viewModelScope.launch { today.value = repository.getRandom() }
    }

    fun toggleFavorite(quote: Quote) {
        viewModelScope.launch { repository.toggleFavorite(quote) }
    }

    private fun Quote.matches(q: String): Boolean {
        val needle = q.trim()
        return text.contains(needle, ignoreCase = true) ||
            bookTitle.contains(needle, ignoreCase = true) ||
            author.contains(needle, ignoreCase = true) ||
            note.contains(needle, ignoreCase = true)
    }
}
