package com.app.mobile

import okhttp3.OkHttpClient
import okhttp3.JavaNetCookieJar
import java.net.CookieManager
import java.net.CookiePolicy

object ApiClient {

    const val BASE_URL = "http://10.0.2.2:8080"

    private val cookieManager = CookieManager().apply {
        setCookiePolicy(CookiePolicy.ACCEPT_ALL)
    }

    val http = OkHttpClient.Builder()
        .cookieJar(JavaNetCookieJar(cookieManager))
        .build()
}