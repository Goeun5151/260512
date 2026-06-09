package com.onelinebook.data.prefs

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.onelinebook.ui.theme.ThemeMode
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "settings")

/** Snapshot of user-configurable settings. */
data class Settings(
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
    val dailyEnabled: Boolean = false,
    val dailyHour: Int = 8,
    val dailyMinute: Int = 0,
)

class UserPreferences(private val context: Context) {

    private object Keys {
        val THEME = stringPreferencesKey("theme_mode")
        val DAILY_ENABLED = booleanPreferencesKey("daily_enabled")
        val DAILY_HOUR = intPreferencesKey("daily_hour")
        val DAILY_MINUTE = intPreferencesKey("daily_minute")
    }

    val settings: Flow<Settings> = context.dataStore.data.map { p ->
        Settings(
            themeMode = runCatching { ThemeMode.valueOf(p[Keys.THEME] ?: "SYSTEM") }
                .getOrDefault(ThemeMode.SYSTEM),
            dailyEnabled = p[Keys.DAILY_ENABLED] ?: false,
            dailyHour = p[Keys.DAILY_HOUR] ?: 8,
            dailyMinute = p[Keys.DAILY_MINUTE] ?: 0,
        )
    }

    suspend fun setThemeMode(mode: ThemeMode) {
        context.dataStore.edit { it[Keys.THEME] = mode.name }
    }

    suspend fun setDailyEnabled(enabled: Boolean) {
        context.dataStore.edit { it[Keys.DAILY_ENABLED] = enabled }
    }

    suspend fun setDailyTime(hour: Int, minute: Int) {
        context.dataStore.edit {
            it[Keys.DAILY_HOUR] = hour
            it[Keys.DAILY_MINUTE] = minute
        }
    }
}
