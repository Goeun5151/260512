package com.onelinebook.util

import android.content.Context
import android.content.Intent
import com.onelinebook.data.local.Quote

object ShareUtil {
    fun shareQuote(context: Context, quote: Quote) {
        val builder = StringBuilder()
        builder.append("“").append(quote.text.trim()).append("”")
        val attribution = buildList {
            if (quote.bookTitle.isNotBlank()) add("《${quote.bookTitle}》")
            if (quote.author.isNotBlank()) add(quote.author)
        }.joinToString(" · ")
        if (attribution.isNotBlank()) builder.append("\n\n— ").append(attribution)

        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, builder.toString())
        }
        context.startActivity(Intent.createChooser(intent, null))
    }
}
