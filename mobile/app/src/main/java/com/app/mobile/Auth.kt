package com.app.mobile

import android.content.Intent
import android.os.Bundle
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.util.Patterns
import android.view.View
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class Auth : AppCompatActivity() {

    private var isSignInPasswordVisible = false
    private var isRegPasswordVisible = false
    private var isConfirmPasswordVisible = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auth)

        // Skip login if already logged in
        if (SessionManager.isLoggedIn(this)) {
            // TODO: startActivity(Intent(this, HomeActivity::class.java))
            // finish()
            // return
        }

        // Views
        val tvSignInTab       = findViewById<TextView>(R.id.tvSignInTab)
        val tvCreateAccTab    = findViewById<TextView>(R.id.tvCreateAccountTab)
        val layoutSignIn      = findViewById<LinearLayout>(R.id.layoutSignIn)
        val layoutCreateAcc   = findViewById<LinearLayout>(R.id.layoutCreateAccount)
        val tvTitle           = findViewById<TextView>(R.id.tvTitle)
        val tvSubtitle        = findViewById<TextView>(R.id.tvSubtitle)

        // Sign In fields
        val etSignInEmail     = findViewById<EditText>(R.id.etSignInEmail)
        val etSignInPassword  = findViewById<EditText>(R.id.etSignInPassword)
        val ivToggleSignIn    = findViewById<ImageView>(R.id.ivToggleSignInPassword)
        val btnSignIn         = findViewById<MaterialButton>(R.id.btnSignIn)
        val btnClearSignIn    = findViewById<MaterialButton>(R.id.btnClearSignIn)
        val tvForgotPassword  = findViewById<TextView>(R.id.tvForgotPassword)
        val tvGoToSignUp      = findViewById<TextView>(R.id.tvGoToSignUp)

        // Register fields
        val etFirstName       = findViewById<EditText>(R.id.etFirstName)
        val etLastName        = findViewById<EditText>(R.id.etLastName)
        val etRegEmail        = findViewById<EditText>(R.id.etRegEmail)
        val etRegPassword     = findViewById<EditText>(R.id.etRegPassword)
        val etConfirmPassword = findViewById<EditText>(R.id.etConfirmPassword)
        val ivToggleRegPwd    = findViewById<ImageView>(R.id.ivToggleRegPassword)
        val ivToggleConfPwd   = findViewById<ImageView>(R.id.ivToggleConfirmPassword)
        val btnCreateAccount  = findViewById<MaterialButton>(R.id.btnCreateAccount)
        val btnClearRegister  = findViewById<MaterialButton>(R.id.btnClearRegister)
        val tvGoToSignIn      = findViewById<TextView>(R.id.tvGoToSignIn)
        val btnGuest          = findViewById<MaterialButton>(R.id.btnContinueAsGuest)

        // ── Email validator ───────────────────────────────────────────
        fun isValidEmail(email: String): Boolean {
            return Patterns.EMAIL_ADDRESS.matcher(email).matches()
        }

        // ── Clear helpers ─────────────────────────────────────────────
        fun clearSignInForm() {
            etSignInEmail.text.clear()
            etSignInPassword.text.clear()
            isSignInPasswordVisible = false
            etSignInPassword.transformationMethod = PasswordTransformationMethod.getInstance()
            ivToggleSignIn.setImageResource(R.drawable.ic_visibility_off)
        }

        fun clearRegisterForm() {
            etFirstName.text.clear()
            etLastName.text.clear()
            etRegEmail.text.clear()
            etRegPassword.text.clear()
            etConfirmPassword.text.clear()
            isRegPasswordVisible = false
            isConfirmPasswordVisible = false
            etRegPassword.transformationMethod = PasswordTransformationMethod.getInstance()
            etConfirmPassword.transformationMethod = PasswordTransformationMethod.getInstance()
            ivToggleRegPwd.setImageResource(R.drawable.ic_visibility_off)
            ivToggleConfPwd.setImageResource(R.drawable.ic_visibility_off)
        }

        // ── Tab switcher ──────────────────────────────────────────────
        fun showSignIn(prefillEmail: String? = null) {
            clearSignInForm()
            prefillEmail?.let {
                etSignInEmail.setText(it)
                etSignInPassword.requestFocus()
            }
            layoutSignIn.visibility = View.VISIBLE
            layoutCreateAcc.visibility = View.GONE
            tvTitle.text = "Welcome Back"
            tvSubtitle.text = "Sign in to manage your bookings and rentals"
            tvSignInTab.setBackgroundResource(R.drawable.bg_card_white)
            tvSignInTab.setTextColor(getColor(R.color.brand_burgundy))
            tvSignInTab.paint.isFakeBoldText = true
            tvSignInTab.elevation = 3f
            tvCreateAccTab.setBackgroundColor(android.graphics.Color.TRANSPARENT)
            tvCreateAccTab.setTextColor(getColor(R.color.brand_text_subtitle))
            tvCreateAccTab.paint.isFakeBoldText = false
            tvCreateAccTab.elevation = 0f
        }

        fun showCreateAccount() {
            clearRegisterForm()
            layoutSignIn.visibility = View.GONE
            layoutCreateAcc.visibility = View.VISIBLE
            tvTitle.text = "Create Account"
            tvSubtitle.text = "Join EventWear to get started with premium rentals"
            tvCreateAccTab.setBackgroundResource(R.drawable.bg_card_white)
            tvCreateAccTab.setTextColor(getColor(R.color.brand_burgundy))
            tvCreateAccTab.paint.isFakeBoldText = true
            tvCreateAccTab.elevation = 3f
            tvSignInTab.setBackgroundColor(android.graphics.Color.TRANSPARENT)
            tvSignInTab.setTextColor(getColor(R.color.brand_text_subtitle))
            tvSignInTab.paint.isFakeBoldText = false
            tvSignInTab.elevation = 0f
        }

        tvSignInTab.setOnClickListener { showSignIn() }
        tvCreateAccTab.setOnClickListener { showCreateAccount() }
        tvGoToSignUp.setOnClickListener { showCreateAccount() }
        tvGoToSignIn.setOnClickListener { showSignIn() }

        // ── Password toggles ──────────────────────────────────────────
        ivToggleSignIn.setOnClickListener {
            isSignInPasswordVisible = !isSignInPasswordVisible
            etSignInPassword.transformationMethod =
                if (isSignInPasswordVisible) HideReturnsTransformationMethod.getInstance()
                else PasswordTransformationMethod.getInstance()
            ivToggleSignIn.setImageResource(
                if (isSignInPasswordVisible) R.drawable.ic_visibility
                else R.drawable.ic_visibility_off
            )
            etSignInPassword.setSelection(etSignInPassword.text.length)
        }

        ivToggleRegPwd.setOnClickListener {
            isRegPasswordVisible = !isRegPasswordVisible
            etRegPassword.transformationMethod =
                if (isRegPasswordVisible) HideReturnsTransformationMethod.getInstance()
                else PasswordTransformationMethod.getInstance()
            ivToggleRegPwd.setImageResource(
                if (isRegPasswordVisible) R.drawable.ic_visibility
                else R.drawable.ic_visibility_off
            )
            etRegPassword.setSelection(etRegPassword.text.length)
        }

        ivToggleConfPwd.setOnClickListener {
            isConfirmPasswordVisible = !isConfirmPasswordVisible
            etConfirmPassword.transformationMethod =
                if (isConfirmPasswordVisible) HideReturnsTransformationMethod.getInstance()
                else PasswordTransformationMethod.getInstance()
            ivToggleConfPwd.setImageResource(
                if (isConfirmPasswordVisible) R.drawable.ic_visibility
                else R.drawable.ic_visibility_off
            )
            etConfirmPassword.setSelection(etConfirmPassword.text.length)
        }

        // ── Sign In button ────────────────────────────────────────────
        btnSignIn.setOnClickListener {
            val email    = etSignInEmail.text.toString().trim()
            val password = etSignInPassword.text.toString().trim()
            when {
                email.isEmpty()      -> Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
                !isValidEmail(email) -> Toast.makeText(this, "Please enter a valid email address", Toast.LENGTH_SHORT).show()
                password.isEmpty()   -> Toast.makeText(this, "Please enter your password", Toast.LENGTH_SHORT).show()
                else -> {
                    btnSignIn.isEnabled = false
                    btnSignIn.text = "SIGNING IN..."
                    AuthRepository.login(
                        email, password,
                        onSuccess = { userId, firstName, lastName, role ->
                            runOnUiThread {
                                SessionManager.saveUser(this, userId, firstName, lastName, email, role)
                                clearSignInForm()
                                Toast.makeText(this, "Welcome back, $firstName!", Toast.LENGTH_SHORT).show()
                                btnSignIn.isEnabled = true
                                btnSignIn.text = "SIGN IN  →"
                                // TODO: startActivity(Intent(this, HomeActivity::class.java))
                                // finish()
                            }
                        },
                        onError = { message ->
                            runOnUiThread {
                                Toast.makeText(this, message, Toast.LENGTH_LONG).show()
                                btnSignIn.isEnabled = true
                                btnSignIn.text = "SIGN IN  →"
                            }
                        }
                    )
                }
            }
        }

        // ── Create Account button ─────────────────────────────────────
        btnCreateAccount.setOnClickListener {
            val firstName = etFirstName.text.toString().trim()
            val lastName  = etLastName.text.toString().trim()
            val email     = etRegEmail.text.toString().trim()
            val password  = etRegPassword.text.toString().trim()
            val confirm   = etConfirmPassword.text.toString().trim()
            when {
                firstName.isEmpty()  -> Toast.makeText(this, "Please enter your first name", Toast.LENGTH_SHORT).show()
                lastName.isEmpty()   -> Toast.makeText(this, "Please enter your last name", Toast.LENGTH_SHORT).show()
                email.isEmpty()      -> Toast.makeText(this, "Please enter your email", Toast.LENGTH_SHORT).show()
                !isValidEmail(email) -> Toast.makeText(this, "Please enter a valid email address", Toast.LENGTH_SHORT).show()
                password.length < 6  -> Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                password != confirm  -> Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                else -> {
                    btnCreateAccount.isEnabled = false
                    btnCreateAccount.text = "CREATING ACCOUNT..."
                    AuthRepository.register(
                        firstName, lastName, email, password, confirm,
                        onSuccess = {
                            runOnUiThread {
                                Toast.makeText(this, "Account created! Please sign in.", Toast.LENGTH_LONG).show()
                                btnCreateAccount.isEnabled = true
                                btnCreateAccount.text = "CREATE ACCOUNT  →"
                                showSignIn(prefillEmail = email)
                            }
                        },
                        onError = { message ->
                            runOnUiThread {
                                Toast.makeText(this, message, Toast.LENGTH_LONG).show()
                                btnCreateAccount.isEnabled = true
                                btnCreateAccount.text = "CREATE ACCOUNT  →"
                            }
                        }
                    )
                }
            }
        }

        // ── Clear form buttons ────────────────────────────────────────
        btnClearSignIn.setOnClickListener { clearSignInForm() }
        btnClearRegister.setOnClickListener { clearRegisterForm() }

        // ── Forgot Password ───────────────────────────────────────────
        tvForgotPassword.setOnClickListener {
            Toast.makeText(this, "Forgot password tapped", Toast.LENGTH_SHORT).show()
        }

        // ── Continue as Guest ─────────────────────────────────────────
        btnGuest.setOnClickListener {
            startActivity(Intent(this, GuestDashboardActivity::class.java))
            finish()
        }

        // ── Handle tab intent from GuestDashboardActivity ─────────────
        when (intent.getStringExtra("TAB")) {
            "register" -> showCreateAccount()
            "signin"   -> showSignIn()
        }
    }
}