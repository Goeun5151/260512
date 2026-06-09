package com.onelinebook

import android.app.Application
import com.onelinebook.di.AppContainer
import com.onelinebook.notification.DailyQuoteNotifier

class OneLineApp : Application() {

    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
        DailyQuoteNotifier.createChannel(this)
    }
}
