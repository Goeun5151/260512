package com.onelinebook.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Book
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil.compose.SubcomposeAsyncImage

/** Book cover thumbnail with a graceful placeholder when no image is available. */
@Composable
fun BookCover(
    url: String,
    modifier: Modifier = Modifier,
    width: Dp = 48.dp,
    height: Dp = 68.dp,
) {
    val shape = RoundedCornerShape(6.dp)
    val placeholder: @Composable () -> Unit = {
        Box(
            modifier = Modifier
                .size(width, height)
                .clip(shape)
                .background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Outlined.Book,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(12.dp),
            )
        }
    }
    if (url.isBlank()) {
        Box(modifier) { placeholder() }
    } else {
        SubcomposeAsyncImage(
            model = url,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            loading = { placeholder() },
            error = { placeholder() },
            modifier = modifier
                .size(width, height)
                .clip(shape),
        )
    }
}
