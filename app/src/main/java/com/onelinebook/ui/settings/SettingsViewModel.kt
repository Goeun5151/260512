package com.onelinebook.ui.settings

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.onelinebook.data.prefs.Settings
import com.onelinebook.data.prefs.UserPreferences
import com.onelinebook.notification.DailyQuoteWorker
import com.onelinebook.ui.theme.ThemeMode
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SettingsViewModel(
    application: Application,
    private val prefs: UserPreferences,
) : AndroidViewModel(application) {

    val settings: StateFlow<Settings> = prefs.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), Settings())

    fun setThemeMode(mode: ThemeMode) {
        viewModelScope.launch { prefs.setThemeMode(mode) }
    }

    fun setDailyEnabled(enabled: Boolean) {
        viewModelScope.launch {
            prefs.setDailyEnabled(enabled)
            val current = settings.value
            if (enabled) {
                DailyQuoteWorker.schedule(getApplication(), current.dailyHour, current.dailyMinute)
            } else {
                DailyQuoteWorker.cancel(getApplication())
            }
        }
    }

    fun setDailyTime(hour: Int, minute: Int) {
        viewModelScope.launch {
            prefs.setDailyTime(hour, minute)
            if (settings.value.dailyEnabled) {
                DailyQuoteWorker.schedule(getApplication(), hour, minute)
            }
        }
    }
}
