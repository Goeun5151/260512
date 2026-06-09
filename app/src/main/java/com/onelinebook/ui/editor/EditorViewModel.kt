package com.onelinebook.ui.editor

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.onelinebook.data.local.Quote
import com.onelinebook.data.remote.BookResult
import com.onelinebook.data.repository.QuoteRepository
import com.onelinebook.ui.navigation.Routes
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class EditorUiState(
    val id: Long = 0,
    val text: String = "",
    val bookTitle: String = "",
    val author: String = "",
    val page: String = "",
    val note: String = "",
    val coverUrl: String = "",
    val isFavorite: Boolean = false,
    val isEditing: Boolean = false,
    val showError: Boolean = false,
    val saved: Boolean = false,
)

class EditorViewModel(
    private val repository: QuoteRepository,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val quoteId: Long = savedStateHandle[Routes.EDITOR_ARG_ID] ?: 0L

    private val _state = MutableStateFlow(EditorUiState(id = quoteId, isEditing = quoteId != 0L))
    val state: StateFlow<EditorUiState> = _state.asStateFlow()

    init {
        if (quoteId != 0L) {
            viewModelScope.launch {
                repository.getQuote(quoteId)?.let { q ->
                    _state.update {
                        it.copy(
                            id = q.id,
                            text = q.text,
                            bookTitle = q.bookTitle,
                            author = q.author,
                            page = q.page?.toString() ?: "",
                            note = q.note,
                            coverUrl = q.coverUrl,
                            isFavorite = q.isFavorite,
                            isEditing = true,
                        )
                    }
                }
            }
        }
    }

    fun onTextChange(v: String) = _state.update { it.copy(text = v, showError = false) }
    fun onBookTitleChange(v: String) = _state.update { it.copy(bookTitle = v) }
    fun onAuthorChange(v: String) = _state.update { it.copy(author = v) }
    fun onPageChange(v: String) = _state.update { it.copy(page = v.filter(Char::isDigit)) }
    fun onNoteChange(v: String) = _state.update { it.copy(note = v) }

    fun applyBook(book: BookResult) = _state.update {
        it.copy(bookTitle = book.title, author = book.author, coverUrl = book.coverUrl)
    }

    fun save() {
        val current = _state.value
        if (current.text.isBlank()) {
            _state.update { it.copy(showError = true) }
            return
        }
        viewModelScope.launch {
            repository.save(
                Quote(
                    id = current.id,
                    text = current.text.trim(),
                    bookTitle = current.bookTitle.trim(),
                    author = current.author.trim(),
                    page = current.page.toIntOrNull(),
                    note = current.note.trim(),
                    coverUrl = current.coverUrl,
                    isFavorite = current.isFavorite,
                )
            )
            _state.update { it.copy(saved = true) }
        }
    }
}
