package com.onelinebook.notification

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.onelinebook.OneLineApp
import com.onelinebook.R
import java.util.Calendar
import java.util.concurrent.TimeUnit

/** Posts a random saved quote once a day. */
class DailyQuoteWorker(
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val app = applicationContext as OneLineApp
        val quote = app.container.quoteRepository.getRandom() ?: return Result.success()
        val book = quote.bookTitle.ifBlank { applicationContext.getString(R.string.unknown_book) }
        DailyQuoteNotifier.show(applicationContext, quote.text, book)
        return Result.success()
    }

    companion object {
        private const val WORK_NAME = "daily_one_line_work"

        fun schedule(context: Context, hour: Int, minute: Int) {
            val initialDelay = computeInitialDelayMillis(hour, minute)
            val request = PeriodicWorkRequestBuilder<DailyQuoteWorker>(1, TimeUnit.DAYS)
                .setInitialDelay(initialDelay, TimeUnit.MILLISECONDS)
                .build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.UPDATE,
                request,
            )
        }

        fun cancel(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME)
        }

        private fun computeInitialDelayMillis(hour: Int, minute: Int): Long {
            val now = Calendar.getInstance()
            val next = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
                if (before(now)) add(Calendar.DAY_OF_MONTH, 1)
            }
            return next.timeInMillis - now.timeInMillis
        }
    }
}
