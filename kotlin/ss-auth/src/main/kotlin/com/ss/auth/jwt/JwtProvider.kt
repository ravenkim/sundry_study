package com.ss.auth.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtProvider(@Value("\${jwt.secret}") private val secret: String) {

    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateToken(userDetails: UserDetails): String {
        val claims: MutableMap<String, Any> = mutableMapOf()
        claims["roles"] = userDetails.authorities.map { it.authority }

        return Jwts.builder()
            .claims(claims)
            .subject(userDetails.username)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
            .signWith(key)
            .compact()
    }

    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parser().verifyWith(key as javax.crypto.SecretKey).build().parseSignedClaims(token)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getUsernameFromToken(token: String): String {
        return Jwts.parser().verifyWith(key as javax.crypto.SecretKey).build().parseSignedClaims(token).payload.subject
    }

    fun getClaimsFromToken(token: String): Claims {
        return Jwts.parser().verifyWith(key as javax.crypto.SecretKey).build().parseSignedClaims(token).payload
    }
}
