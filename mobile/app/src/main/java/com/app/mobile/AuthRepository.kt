package com.app.mobile

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

object AuthRepository {

    private val JSON_TYPE = "application/json".toMediaType()

    // ── Login ─────────────────────────────────────────────────────────
    fun login(
        email: String,
        password: String,
        onSuccess: (userId: Long, firstName: String, lastName: String, role: String) -> Unit,
        onError: (message: String) -> Unit
    ) {
        val body = JSONObject().apply {
            put("email", email)
            put("password", password)
        }.toString().toRequestBody(JSON_TYPE)

        val request = Request.Builder()
            .url("${ApiClient.BASE_URL}/api/auth/login")
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build()

        ApiClient.http.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: Call, e: java.io.IOException) {
                onError("Network error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                if (response.isSuccessful && responseBody != null) {
                    val json = JSONObject(responseBody)
                    onSuccess(
                        json.getLong("id"),
                        json.getString("firstName"),
                        json.getString("lastName"),
                        json.getString("role")
                    )
                } else {
                    onError(responseBody ?: "Invalid email or password")
                }
            }
        })
    }

    // ── Register ──────────────────────────────────────────────────────
    fun register(
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        confirmPassword: String,
        onSuccess: () -> Unit,
        onError: (message: String) -> Unit
    ) {
        val body = JSONObject().apply {
            put("firstName", firstName)
            put("lastName", lastName)
            put("email", email)
            put("password", password)
            put("confirmPassword", confirmPassword)
        }.toString().toRequestBody(JSON_TYPE)

        val request = Request.Builder()
            .url("${ApiClient.BASE_URL}/api/auth/register")
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build()

        ApiClient.http.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: Call, e: java.io.IOException) {
                onError("Network error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError(responseBody ?: "Registration failed")
                }
            }
        })
    }

    // ── Logout ────────────────────────────────────────────────────────
    fun logout(
        onSuccess: () -> Unit,
        onError: (message: String) -> Unit
    ) {
        val request = Request.Builder()
            .url("${ApiClient.BASE_URL}/api/auth/logout")
            .post("".toRequestBody(null))
            .build()

        ApiClient.http.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: Call, e: java.io.IOException) {
                onError("Network error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                onSuccess()
            }
        })
    }
}