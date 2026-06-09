package com.onelinebook.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Ink,
    onPrimary = Color.White,
    primaryContainer = IvorySoft,
    onPrimaryContainer = Ink,
    secondary = Ink,
    onSecondary = Color.White,
    tertiary = Ink,
    background = Ivory,
    onBackground = Ink,
    surface = CardWhite,
    onSurface = Ink,
    surfaceVariant = IvorySoft,
    onSurfaceVariant = InkSoft,
    outline = Line,
    outlineVariant = Line,
    error = Color(0xFF8E1F1F),
    onError = Color.White,
)

private val DarkColors = darkColorScheme(
    primary = NightText,
    onPrimary = NightBg,
    primaryContainer = NightSurface,
    onPrimaryContainer = NightText,
    secondary = NightText,
    onSecondary = NightBg,
    tertiary = NightText,
    background = NightBg,
    onBackground = NightText,
    surface = NightCard,
    onSurface = NightText,
    surfaceVariant = NightSurface,
    onSurfaceVariant = NightTextSoft,
    outline = NightLine,
    outlineVariant = NightLine,
    error = Color(0xFFE0A0A0),
    onError = NightBg,
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
