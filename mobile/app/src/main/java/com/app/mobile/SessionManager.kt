package com.app.mobile

import android.content.Context

object SessionManager {

    private const val PREF_NAME  = "auth_prefs"
    private const val KEY_ID         = "user_id"
    private const val KEY_FIRST_NAME = "first_name"
    private const val KEY_LAST_NAME  = "last_name"
    private const val KEY_EMAIL      = "email"
    private const val KEY_ROLE       = "role"

    fun saveUser(
        context: Context,
        id: Long,
        firstName: String,
        lastName: String,
        email: String,
        role: String
    ) {
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE).edit()
            .putLong(KEY_ID, id)
            .putString(KEY_FIRST_NAME, firstName)
            .putString(KEY_LAST_NAME, lastName)
            .putString(KEY_EMAIL, email)
            .putString(KEY_ROLE, role)
            .apply()
    }

    fun isLoggedIn(context: Context): Boolean {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getLong(KEY_ID, -1L) != -1L
    }

    fun getUserId(context: Context): Long {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getLong(KEY_ID, -1L)
    }

    fun getFirstName(context: Context): String? {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getString(KEY_FIRST_NAME, null)
    }

    fun getRole(context: Context): String? {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getString(KEY_ROLE, null)
    }

    fun clearSession(context: Context) {
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .edit().clear().apply()
    }
}