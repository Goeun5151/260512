package com.onelinebook.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.onelinebook.R

/**
 * Fills the whole window with a subtle ivory paper texture so every screen
 * sits on real "paper". Screens above this use transparent scaffolds.
 */
@Composable
fun PaperBackground(
    dark: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(
                if (dark) R.drawable.paper_texture_dark else R.drawable.paper_texture_light
            ),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
        )
        content()
    }
}
