package com.ss.auth

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component

@SpringBootApplication
open class AuthApplication

fun main(args: Array<String>) {
	println("🚀 Starting SS Authentication Service...")
	runApplication<AuthApplication>(*args)
}

@Component
class ApplicationStartupListener(
	private val environment: Environment
) {
	
	@EventListener(ApplicationReadyEvent::class)
	fun onApplicationReady() {
		val port = environment.getProperty("server.port", "8080")
		val contextPath = environment.getProperty("server.servlet.context-path", "")
		
		println("=".repeat(60))
		println("🎉 SS Authentication Service is Ready!")
		println("📖 Swagger UI: http://localhost:$port$contextPath/swagger-ui.html")
		println("📚 API Docs: http://localhost:$port$contextPath/api-docs")
		println("🔗 Health Check: http://localhost:$port$contextPath/api/health")
		println("ℹ️  Service Info: http://localhost:$port$contextPath/api/info")
		println("🔐 Traditional Login: http://localhost:$port$contextPath/api/auth/traditional/login")
		println("🌐 SSO Status: http://localhost:$port$contextPath/api/auth/sso/status")
		println("=".repeat(60))
	}
}