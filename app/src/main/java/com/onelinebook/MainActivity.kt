package com.onelinebook

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import com.onelinebook.data.prefs.Settings
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.onelinebook.data.remote.BookResult
import com.onelinebook.ui.booksearch.BookSearchScreen
import com.onelinebook.ui.detail.DetailScreen
import com.onelinebook.ui.editor.EditorScreen
import com.onelinebook.ui.home.HomeScreen
import com.onelinebook.ui.navigation.NavKeys
import com.onelinebook.ui.navigation.Routes
import com.onelinebook.ui.settings.SettingsScreen
import com.onelinebook.ui.theme.OneLineBookTheme

class MainActivity : ComponentActivity() {

    private val requestNotificationPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        maybeRequestNotificationPermission()

        val prefs = (application as OneLineApp).container.userPreferences

        setContent {
            val settings by prefs.settings.collectAsStateWithLifecycle(initialValue = Settings())
            OneLineBookTheme(themeMode = settings.themeMode) {
                OneLineNavHost()
            }
        }
    }

    private fun maybeRequestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ContextCompat.checkSelfPermission(
                this, Manifest.permission.POST_NOTIFICATIONS,
            ) == PackageManager.PERMISSION_GRANTED
            if (!granted) {
                requestNotificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun OneLineNavHost() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Routes.HOME) {
        composable(Routes.HOME) {
            HomeScreen(
                onAdd = { navController.navigate(Routes.editor()) },
                onOpenQuote = { navController.navigate(Routes.detail(it)) },
                onOpenSettings = { navController.navigate(Routes.SETTINGS) },
            )
        }

        composable(
            route = Routes.EDITOR_ROUTE,
            arguments = listOf(
                navArgument(Routes.EDITOR_ARG_ID) {
                    type = NavType.LongType
                    defaultValue = 0L
                },
            ),
        ) { entry ->
            val editorViewModel: com.onelinebook.ui.editor.EditorViewModel =
                androidx.lifecycle.viewmodel.compose.viewModel(
                    factory = com.onelinebook.ui.AppViewModelProvider.Factory,
                )

            // Receive a book picked on the search screen.
            val pickedBook by entry.savedStateHandle
                .getStateFlow<BookResult?>(NavKeys.PICKED_BOOK, null)
                .collectAsState()
            androidx.compose.runtime.LaunchedEffect(pickedBook) {
                pickedBook?.let {
                    editorViewModel.applyBook(it)
                    entry.savedStateHandle[NavKeys.PICKED_BOOK] = null
                }
            }

            EditorScreen(
                onBack = { navController.popBackStack() },
                onSaved = { navController.popBackStack() },
                onSearchBook = { navController.navigate(Routes.BOOK_SEARCH) },
                viewModel = editorViewModel,
            )
        }

        composable(
            route = Routes.DETAIL_ROUTE,
            arguments = listOf(
                navArgument(Routes.DETAIL_ARG_ID) { type = NavType.LongType },
            ),
        ) {
            DetailScreen(
                onBack = { navController.popBackStack() },
                onEdit = { id ->
                    navController.navigate(Routes.editor(id))
                },
            )
        }

        composable(Routes.BOOK_SEARCH) {
            BookSearchScreen(
                onBack = { navController.popBackStack() },
                onPick = { book ->
                    navController.previousBackStackEntry
                        ?.savedStateHandle
                        ?.set(NavKeys.PICKED_BOOK, book)
                    navController.popBackStack()
                },
            )
        }

        composable(Routes.SETTINGS) {
            SettingsScreen(onBack = { navController.popBackStack() })
        }
    }
}
