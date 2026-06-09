package com.onelinebook.util

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object DateUtil {
    private val formatter = SimpleDateFormat("yyyy.MM.dd", Locale.KOREA)
    fun format(epochMillis: Long): String = formatter.format(Date(epochMillis))
}
