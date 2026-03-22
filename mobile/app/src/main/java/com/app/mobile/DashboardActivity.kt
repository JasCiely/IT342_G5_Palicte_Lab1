package com.app.mobile

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.NestedScrollView
import com.google.android.material.button.MaterialButton

class DashboardActivity : AppCompatActivity() {

    private var activeTab = "Overview"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        // ── User Info ─────────────────────────────────────────────────
        val firstName = SessionManager.getFirstName(this) ?: "User"

        // ── Header Views ──────────────────────────────────────────────
        val tvWelcome         = findViewById<TextView>(R.id.tvWelcome)
        val tvSubtitle        = findViewById<TextView>(R.id.tvHeaderSubtitle)
        val btnBrowseOutfits  = findViewById<MaterialButton>(R.id.btnBrowseOutfits)
        val btnLogout         = findViewById<MaterialButton>(R.id.btnLogout)

        // ── Nav Views ─────────────────────────────────────────────────
        val navOverview       = findViewById<LinearLayout>(R.id.navOverview)
        val navMyBookings     = findViewById<LinearLayout>(R.id.navMyBookings)
        val navNotifications  = findViewById<LinearLayout>(R.id.navNotifications)
        val navProfile        = findViewById<LinearLayout>(R.id.navProfile)

        val tvNavOverview     = findViewById<TextView>(R.id.tvNavOverview)
        val tvNavBookings     = findViewById<TextView>(R.id.tvNavBookings)
        val tvNavNotifications = findViewById<TextView>(R.id.tvNavNotifications)
        val tvNavProfile      = findViewById<TextView>(R.id.tvNavProfile)

        // ── Tab Content Views ─────────────────────────────────────────
        val layoutOverview       = findViewById<LinearLayout>(R.id.layoutOverview)
        val layoutMyBookings     = findViewById<LinearLayout>(R.id.layoutMyBookings)
        val layoutNotifications  = findViewById<LinearLayout>(R.id.layoutNotifications)
        val layoutProfile        = findViewById<LinearLayout>(R.id.layoutProfile)

        // ── Profile fields ────────────────────────────────────────────
        val tvProfileName     = findViewById<TextView>(R.id.tvProfileName)
        val tvProfileEmail    = findViewById<TextView>(R.id.tvProfileEmail)
        val tvProfileRole     = findViewById<TextView>(R.id.tvProfileRole)
        val tvProfileInitials = findViewById<TextView>(R.id.tvProfileInitials)

        // ── ScrollView for Browse Outfits scroll ──────────────────────
        val scrollView           = findViewById<NestedScrollView>(R.id.scrollView)
        val sectionPopularPicks  = findViewById<View>(R.id.sectionPopularPicks)

        // ── Set welcome text ──────────────────────────────────────────
        tvWelcome.text = "Welcome back, $firstName!"
        tvSubtitle.text = "Manage your bookings and explore new outfits."

        // ── Set profile info ──────────────────────────────────────────
        val lastName  = SessionManager.getLastName(this) ?: ""
        val email     = SessionManager.getEmail(this) ?: ""
        val role      = SessionManager.getRole(this) ?: "USER"
        val initials  = "${firstName.firstOrNull() ?: ""}${lastName.firstOrNull() ?: ""}".uppercase()

        tvProfileName.text     = "$firstName $lastName"
        tvProfileEmail.text    = email
        tvProfileRole.text     = role
        tvProfileInitials.text = initials

        // ── Tab switcher ──────────────────────────────────────────────
        fun setActiveTab(tab: String) {
            activeTab = tab

            // Hide all content
            layoutOverview.visibility      = View.GONE
            layoutMyBookings.visibility    = View.GONE
            layoutNotifications.visibility = View.GONE
            layoutProfile.visibility       = View.GONE

            // Reset all nav styles
            listOf(tvNavOverview, tvNavBookings, tvNavNotifications, tvNavProfile).forEach {
                it.setTextColor(getColor(R.color.brand_text_subtitle))
                it.paint.isFakeBoldText = false
            }
            listOf(navOverview, navMyBookings, navNotifications, navProfile).forEach {
                it.setBackgroundColor(android.graphics.Color.TRANSPARENT)
            }

            // Show active content + highlight nav
            when (tab) {
                "Overview" -> {
                    layoutOverview.visibility = View.VISIBLE
                    tvNavOverview.setTextColor(getColor(R.color.brand_burgundy))
                    tvNavOverview.paint.isFakeBoldText = true
                    navOverview.setBackgroundResource(R.drawable.bg_nav_active)
                }
                "MyBookings" -> {
                    layoutMyBookings.visibility = View.VISIBLE
                    tvNavBookings.setTextColor(getColor(R.color.brand_burgundy))
                    tvNavBookings.paint.isFakeBoldText = true
                    navMyBookings.setBackgroundResource(R.drawable.bg_nav_active)
                }
                "Notifications" -> {
                    layoutNotifications.visibility = View.VISIBLE
                    tvNavNotifications.setTextColor(getColor(R.color.brand_burgundy))
                    tvNavNotifications.paint.isFakeBoldText = true
                    navNotifications.setBackgroundResource(R.drawable.bg_nav_active)
                }
                "Profile" -> {
                    layoutProfile.visibility = View.VISIBLE
                    tvNavProfile.setTextColor(getColor(R.color.brand_burgundy))
                    tvNavProfile.paint.isFakeBoldText = true
                    navProfile.setBackgroundResource(R.drawable.bg_nav_active)
                }
            }
        }

        // ── Nav click listeners ───────────────────────────────────────
        navOverview.setOnClickListener      { setActiveTab("Overview") }
        navMyBookings.setOnClickListener    { setActiveTab("MyBookings") }
        navNotifications.setOnClickListener { setActiveTab("Notifications") }
        navProfile.setOnClickListener       { setActiveTab("Profile") }

        // ── Browse Outfits → scroll to Popular Picks ──────────────────
        btnBrowseOutfits.setOnClickListener {
            setActiveTab("Overview")
            scrollView.post {
                scrollView.smoothScrollTo(0, sectionPopularPicks.top)
            }
        }

        // ── Logout ────────────────────────────────────────────────────
        btnLogout.setOnClickListener {
            AuthRepository.logout(
                onSuccess = {
                    runOnUiThread {
                        SessionManager.clearSession(this)
                        val intent = Intent(this, Auth::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)
                        finish()
                    }
                },
                onError = {
                    runOnUiThread {
                        // Even if logout API fails, clear local session
                        SessionManager.clearSession(this)
                        val intent = Intent(this, Auth::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)
                        finish()
                    }
                }
            )
        }

        // ── Default tab ───────────────────────────────────────────────
        setActiveTab("Overview")
    }
}