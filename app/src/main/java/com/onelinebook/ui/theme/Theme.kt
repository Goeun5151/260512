package com.onelinebook.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Espresso,
    onPrimary = Paper,
    primaryContainer = PaperDim,
    onPrimaryContainer = EspressoDark,
    secondary = Gold,
    onSecondary = Ink,
    tertiary = EspressoDark,
    background = Paper,
    onBackground = Ink,
    surface = PaperCard,
    onSurface = Ink,
    surfaceVariant = PaperDim,
    onSurfaceVariant = InkSoft,
    outline = LineLight,
    outlineVariant = LineLight,
    error = Color(0xFFB3261E),
    onError = Color.White,
)

private val DarkColors = darkColorScheme(
    primary = NightEspresso,
    onPrimary = NightInk,
    primaryContainer = NightSurface,
    onPrimaryContainer = NightEspresso,
    secondary = NightGold,
    onSecondary = NightInk,
    tertiary = NightGold,
    background = NightInk,
    onBackground = NightText,
    surface = NightCard,
    onSurface = NightText,
    surfaceVariant = NightSurface,
    onSurfaceVariant = NightTextSoft,
    outline = NightLine,
    outlineVariant = NightLine,
    error = Color(0xFFF2B8B5),
    onError = NightInk,
)

/** App theme modes selectable in Settings. */
enum class ThemeMode { SYSTEM, LIGHT, DARK }

@Composable
fun OneLineBookTheme(
    themeMode: ThemeMode = ThemeMode.SYSTEM,
    content: @Composable () -> Unit,
) {
    val dark = when (themeMode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }
    MaterialTheme(
        colorScheme = if (dark) DarkColors else LightColors,
        typography = Typography,
        content = content,
    )
}
