package com.onelinebook.ui.detail

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.onelinebook.data.local.Quote
import com.onelinebook.data.repository.QuoteRepository
import com.onelinebook.ui.navigation.Routes
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class DetailViewModel(
    private val repository: QuoteRepository,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val quoteId: Long = savedStateHandle[Routes.DETAIL_ARG_ID] ?: 0L

    val quote: StateFlow<Quote?> = repository.observeQuote(quoteId)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    fun toggleFavorite() {
        viewModelScope.launch {
            quote.value?.let { repository.toggleFavorite(it) }
        }
    }

    fun delete(onDeleted: () -> Unit) {
        viewModelScope.launch {
            quote.value?.let { repository.delete(it) }
            onDeleted()
        }
    }
}
