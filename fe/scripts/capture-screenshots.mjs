#!/usr/bin/env node
/**
 * EcoReport 화면 스크린샷 캡처 (Pretendard 폰트 로드 대기)
 * Usage: node scripts/capture-screenshots.mjs [--base-url=http://localhost:8081]
 */
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const OUTPUT_DIR = path.join(ROOT, 'docs/화면')

const BASE_URL =
    process.argv.find((a) => a.startsWith('--base-url='))?.split('=')[1] ??
    process.env.SCREENSHOT_BASE_URL ??
    'http://localhost:8081'
const API_URL =
    process.env.SCREENSHOT_API_URL ??
    process.env.VITE_API_HOST ??
    'http://localhost:8080'

const VIEWPORT = { width: 390, height: 844 }
const ADMIN_VIEWPORT = { width: 1280, height: 800 }
const USER = { userName: 'user', password: 'user1234!' }
const ADMIN = { userName: 'admin', password: 'admin1234!' }

const REPORT_SUCCESS_STATE = {
    aiResult: {
        result: 'WASTE_DETECTED',
        message: '조명과 에어컨이 켜져 있는 것으로 확인되었습니다.',
        ac_status: 'ON',
        light_status: 'ON',
        pointAwarded: 100,
        currentBalance: 350,
    },
    buildingName: '공학관 A동',
    roomName: '303호',
    status: 'APPROVED',
}

async function waitForFonts(page) {
    await page.evaluate(async () => {
        await document.fonts.ready
        const weights = [400, 500, 600, 700, 800, 900]
        await Promise.all(
            weights.map((w) => document.fonts.load(`${w} 16px Pretendard`)),
        )
    })
}

async function waitForPageReady(page, selector = 'body') {
    await page.waitForSelector(selector, { state: 'visible', timeout: 15000 })
    await waitForFonts(page)
    await page.waitForTimeout(400)
}

async function setupLocale(page) {
    await page.addInitScript(() => {
        localStorage.setItem('i18nextLng', 'ko')
    })
}

async function clearAuth(page) {
    if (!page.url() || page.url() === 'about:blank') {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    }
    await page.evaluate(() => {
        localStorage.removeItem('ecoreport_access_token')
        localStorage.removeItem('ecoreport_user')
        sessionStorage.clear()
    })
}

async function loginViaApi(page, credentials) {
    const resp = await page.request.post(`${API_URL}/api/auth/login`, {
        data: credentials,
        headers: { 'Content-Type': 'application/json' },
    })
    if (!resp.ok()) {
        throw new Error(`Login failed (${resp.status()}): ${await resp.text()}`)
    }
    const json = await resp.json()
    const body = json.body
    if (!body?.accessToken) {
        throw new Error(`Login response invalid: ${JSON.stringify(json)}`)
    }

    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await page.evaluate(
        ({ token, user }) => {
            localStorage.setItem('ecoreport_access_token', token)
            localStorage.setItem(
                'ecoreport_user',
                JSON.stringify({
                    userName: user.userName,
                    email: user.email,
                    buildingId: user.buildingId,
                    buildingName: user.buildingName,
                    userType: user.userType,
                }),
            )
        },
        {
            token: body.accessToken,
            user: {
                userName: body.userName,
                email: body.email,
                buildingId: body.buildingId,
                buildingName: body.buildingName,
                userType: body.userType,
            },
        },
    )
}

async function capture(page, fileName) {
    const filePath = path.join(OUTPUT_DIR, fileName)
    await page.screenshot({ path: filePath, fullPage: false })
    console.log(`  ✓ ${fileName}`)
}

async function gotoAndCapture(page, urlPath, fileName, waitSelector, viewport) {
    if (viewport) {
        await page.setViewportSize(viewport)
    }
    await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle' })
    await waitForPageReady(page, waitSelector)
    await capture(page, fileName)
    if (viewport) {
        await page.setViewportSize(VIEWPORT)
    }
}

async function captureReportSuccess(page) {
    await loginViaApi(page, USER)
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' })
    await waitForPageReady(page)

    await page.evaluate((state) => {
        window.history.pushState(
            { usr: state, key: 'screenshot', idx: 0 },
            '',
            '/report-success',
        )
        window.dispatchEvent(new PopStateEvent('popstate'))
    }, REPORT_SUCCESS_STATE)

    await waitForPageReady(page, 'h1')
    await capture(page, 'screen_report_success.png')
}

async function captureSignup(page) {
    await clearAuth(page)
    await page.evaluate(() => {
        sessionStorage.setItem('ecoreport_pending_affiliation_id', '1')
        sessionStorage.setItem('ecoreport_pending_affiliation_name', '삼육대학교')
    })
    await gotoAndCapture(page, '/signup', 'screen_signup.png', 'form')
}

async function main() {
    await rm(OUTPUT_DIR, { recursive: true, force: true })
    await mkdir(OUTPUT_DIR, { recursive: true })

    console.log(`Base URL : ${BASE_URL}`)
    console.log(`API URL  : ${API_URL}`)
    console.log(`Output   : ${OUTPUT_DIR}\n`)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: 2,
        locale: 'ko-KR',
        colorScheme: 'light',
    })
    const page = await context.newPage()
    await setupLocale(page)

    try {
        console.log('[Public]')
        await clearAuth(page)
        await gotoAndCapture(page, '/login', 'screen_login.png', 'h1')

        await clearAuth(page)
        await gotoAndCapture(
            page,
            '/signup/affiliation',
            'screen_signup_affiliation.png',
            'h1',
        )

        await clearAuth(page)
        await gotoAndCapture(page, '/signup/admin', 'screen_signup_admin.png', 'h1')

        await captureSignup(page)

        console.log('\n[User]')
        await loginViaApi(page, USER)
        await gotoAndCapture(page, '/', 'screen_home.png', 'main, [class*="Home"], body')
        await gotoAndCapture(page, '/report-form', 'screen_report_form.png', 'form, main')
        await gotoAndCapture(page, '/reports', 'screen_reports.png', 'main, body')
        await gotoAndCapture(page, '/shop', 'screen_shop.png', 'main, body')
        await gotoAndCapture(page, '/profile', 'screen_profile.png', 'main, body')
        await captureReportSuccess(page)

        console.log('\n[Admin]')
        await clearAuth(page)
        await loginViaApi(page, ADMIN)
        await gotoAndCapture(
            page,
            '/admin',
            'screen_admin_dashboard.png',
            'main, body',
            ADMIN_VIEWPORT,
        )
        await gotoAndCapture(
            page,
            '/admin/stats',
            'screen_admin_stats.png',
            'main, body',
            ADMIN_VIEWPORT,
        )
        await gotoAndCapture(
            page,
            '/admin/reports',
            'screen_admin_reports.png',
            'main, body',
            ADMIN_VIEWPORT,
        )
        await gotoAndCapture(
            page,
            '/admin/buildings',
            'screen_admin_buildings.png',
            'main, body',
            ADMIN_VIEWPORT,
        )
        await gotoAndCapture(
            page,
            '/admin/points',
            'screen_admin_points.png',
            'main, body',
            ADMIN_VIEWPORT,
        )
        await gotoAndCapture(
            page,
            '/admin/users',
            'screen_admin_users.png',
            'main, body',
            ADMIN_VIEWPORT,
        )

        console.log('\nDone.')
    } finally {
        await browser.close()
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
