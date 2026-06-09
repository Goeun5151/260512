package com.onelinebook.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.ViewAgenda
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.onelinebook.R
import com.onelinebook.data.prefs.ViewMode
import com.onelinebook.data.repository.SortOrder
import com.onelinebook.ui.AppViewModelProvider
import com.onelinebook.ui.components.EmptyState
import com.onelinebook.ui.components.GridQuoteCard
import com.onelinebook.ui.components.QuoteCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onAdd: () -> Unit,
    onOpenQuote: (Long) -> Unit,
    onOpenSettings: () -> Unit,
    viewModel: HomeViewModel = viewModel(factory = AppViewModelProvider.Factory),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val viewMode by viewModel.viewMode.collectAsStateWithLifecycle()

    Scaffold(
        containerColor = Color.Transparent,
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = stringResource(R.string.app_name),
                        style = MaterialTheme.typography.titleLarge,
                    )
                },
                actions = {
                    IconButton(onClick = onOpenSettings) {
                        Icon(Icons.Outlined.Settings, contentDescription = stringResource(R.string.title_settings))
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent,
                ),
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAdd,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
            ) {
                Icon(Icons.Filled.Add, contentDescription = stringResource(R.string.fab_add))
            }
        },
    ) { innerPadding ->
        val columns = if (viewMode == ViewMode.GRID) 2 else 1
        LazyVerticalGrid(
            columns = GridCells.Fixed(columns),
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            fullWidth {
                SearchField(query = state.query, onQueryChange = viewModel::setQuery)
            }
            fullWidth {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    SortChips(
                        selected = state.sortOrder,
                        onSelect = viewModel::setSortOrder,
                        modifier = Modifier.weight(1f),
                    )
                    ViewToggle(viewMode = viewMode, onSelect = viewModel::setViewMode)
                }
            }
            state.today?.let { today ->
                if (state.query.isBlank()) {
                    fullWidth {
                        TodayCard(
                            text = today.text,
                            book = today.bookTitle,
                            onClick = { onOpenQuote(today.id) },
                        )
                    }
                }
            }

            if (!state.loading && state.quotes.isEmpty()) {
                fullWidth {
                    EmptyState(
                        title = stringResource(R.string.empty_quotes_title),
                        description = stringResource(R.string.empty_quotes_desc),
                        modifier = Modifier.padding(top = 48.dp),
                    )
                }
            }

            items(state.quotes, key = { it.id }) { quote ->
                if (viewMode == ViewMode.GRID) {
                    GridQuoteCard(
                        quote = quote,
                        onClick = { onOpenQuote(quote.id) },
                        onToggleFavorite = { viewModel.toggleFavorite(quote) },
                    )
                } else {
                    QuoteCard(
                        quote = quote,
                        onClick = { onOpenQuote(quote.id) },
                        onToggleFavorite = { viewModel.toggleFavorite(quote) },
                    )
                }
            }
        }
    }
}

/** Header rows always span the full grid width. */
private fun androidx.compose.foundation.lazy.grid.LazyGridScope.fullWidth(
    content: @Composable () -> Unit,
) = item(span = { GridItemSpan(maxLineSpan) }) { content() }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SearchField(query: String, onQueryChange: (String) -> Unit) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = Modifier.fillMaxWidth(),
        placeholder = { Text(stringResource(R.string.search_hint)) },
        leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null) },
        singleLine = true,
        shape = RoundedCornerShape(16.dp),
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SortChips(selected: SortOrder, onSelect: (SortOrder) -> Unit, modifier: Modifier = Modifier) {
    Row(modifier = modifier, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        val options = listOf(
            SortOrder.LATEST to R.string.sort_latest,
            SortOrder.FAVORITE to R.string.sort_favorite,
            SortOrder.BOOK to R.string.sort_book,
        )
        options.forEach { (order, label) ->
            FilterChip(
                selected = selected == order,
                onClick = { onSelect(order) },
                label = { Text(stringResource(label)) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = MaterialTheme.colorScheme.primary,
                    selectedLabelColor = MaterialTheme.colorScheme.onPrimary,
                ),
            )
        }
    }
}

@Composable
private fun ViewToggle(viewMode: ViewMode, onSelect: (ViewMode) -> Unit) {
    Row {
        ToggleIcon(
            selected = viewMode == ViewMode.LIST,
            imageVector = Icons.Outlined.ViewAgenda,
            description = stringResource(R.string.view_list),
            onClick = { onSelect(ViewMode.LIST) },
        )
        ToggleIcon(
            selected = viewMode == ViewMode.GRID,
            imageVector = Icons.Outlined.GridView,
            description = stringResource(R.string.view_grid),
            onClick = { onSelect(ViewMode.GRID) },
        )
    }
}

@Composable
private fun ToggleIcon(
    selected: Boolean,
    imageVector: androidx.compose.ui.graphics.vector.ImageVector,
    description: String,
    onClick: () -> Unit,
) {
    val bg = if (selected) MaterialTheme.colorScheme.primary else Color.Transparent
    val fg = if (selected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
    Box(
        modifier = Modifier
            .padding(start = 6.dp)
            .size(40.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(bg)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Icon(imageVector, contentDescription = description, tint = fg, modifier = Modifier.size(18.dp))
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TodayCard(text: String, book: String, onClick: () -> Unit) {
    androidx.compose.material3.Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = androidx.compose.material3.CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer,
        ),
    ) {
        Column(Modifier.padding(20.dp)) {
            Text(
                text = stringResource(R.string.today_one_line),
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                text = "“$text”",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.padding(top = 10.dp),
            )
            if (book.isNotBlank()) {
                Text(
                    text = "— 《$book》",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 10.dp),
                )
            }
        }
    }
}
