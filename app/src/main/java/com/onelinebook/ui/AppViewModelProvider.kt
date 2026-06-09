package com.onelinebook.ui

import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.createSavedStateHandle
import androidx.lifecycle.viewmodel.CreationExtras
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.onelinebook.OneLineApp
import com.onelinebook.ui.booksearch.BookSearchViewModel
import com.onelinebook.ui.detail.DetailViewModel
import com.onelinebook.ui.editor.EditorViewModel
import com.onelinebook.ui.home.HomeViewModel
import com.onelinebook.ui.settings.SettingsViewModel

private fun CreationExtras.app(): OneLineApp =
    this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as OneLineApp

object AppViewModelProvider {
    val Factory = viewModelFactory {
        initializer {
            val c = app().container
            HomeViewModel(c.quoteRepository, c.userPreferences)
        }
        initializer {
            val c = app().container
            EditorViewModel(c.quoteRepository, createSavedStateHandle())
        }
        initializer {
            val c = app().container
            DetailViewModel(c.quoteRepository, createSavedStateHandle())
        }
        initializer {
            val c = app().container
            BookSearchViewModel(c.bookSearchRepository)
        }
        initializer {
            val c = app().container
            SettingsViewModel(app(), c.userPreferences)
        }
    }
}
