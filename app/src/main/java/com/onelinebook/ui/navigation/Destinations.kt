package com.onelinebook.ui.navigation

object Routes {
    const val HOME = "home"
    const val SETTINGS = "settings"
    const val BOOK_SEARCH = "book_search"

    const val EDITOR = "editor"
    const val EDITOR_ARG_ID = "quoteId"
    const val EDITOR_ROUTE = "$EDITOR?$EDITOR_ARG_ID={$EDITOR_ARG_ID}"
    fun editor(quoteId: Long = 0L) = "$EDITOR?$EDITOR_ARG_ID=$quoteId"

    const val DETAIL = "detail"
    const val DETAIL_ARG_ID = "quoteId"
    const val DETAIL_ROUTE = "$DETAIL/{$DETAIL_ARG_ID}"
    fun detail(quoteId: Long) = "$DETAIL/$quoteId"
}

/** Key used to hand a chosen book back to the editor via savedStateHandle. */
object NavKeys {
    const val PICKED_BOOK = "picked_book"
}
