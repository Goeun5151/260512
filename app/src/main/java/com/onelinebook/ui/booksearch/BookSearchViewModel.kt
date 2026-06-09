package com.onelinebook.ui.booksearch

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.onelinebook.data.remote.BookResult
import com.onelinebook.data.repository.BookSearchRepository
import com.onelinebook.data.repository.BookSearchState
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class BookSearchUiState(
    val query: String = "",
    val results: List<BookResult> = emptyList(),
    val loading: Boolean = false,
    val missingApiKey: Boolean = false,
    val error: String? = null,
    val searched: Boolean = false,
)

class BookSearchViewModel(
    private val repository: BookSearchRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(BookSearchUiState(missingApiKey = !repository.hasApiKey))
    val state: StateFlow<BookSearchUiState> = _state.asStateFlow()

    private var searchJob: Job? = null

    fun onQueryChange(value: String) {
        _state.update { it.copy(query = value) }
        searchJob?.cancel()
        if (value.isBlank()) {
            _state.update { it.copy(results = emptyList(), searched = false, loading = false) }
            return
        }
        // Debounce as-you-type search.
        searchJob = viewModelScope.launch {
            delay(350)
            runSearch(value)
        }
    }

    fun searchNow() {
        searchJob?.cancel()
        searchJob = viewModelScope.launch { runSearch(_state.value.query) }
    }

    private suspend fun runSearch(query: String) {
        if (query.isBlank()) return
        _state.update { it.copy(loading = true, error = null) }
        when (val result = repository.search(query)) {
            is BookSearchState.MissingApiKey ->
                _state.update { it.copy(loading = false, missingApiKey = true, searched = true) }
            is BookSearchState.Success ->
                _state.update {
                    it.copy(loading = false, results = result.results, searched = true)
                }
            is BookSearchState.Error ->
                _state.update { it.copy(loading = false, error = result.message, searched = true) }
        }
    }
}
