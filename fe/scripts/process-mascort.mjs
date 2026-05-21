/**
 * mascort PNG: 배경 제거(누끼) → trim → resize → PNG + WebP
 * Run: node fe/scripts/process-mascort.mjs
 */
import sharp from 'sharp'
import { mkdir, copyFile, readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MASCORT_DIR = path.join(__dirname, '../src/assets/mascort')
const SOURCE_DIR = path.join(MASCORT_DIR, '_source')
const MAX_EDGE = 512

const EMOTIONS = [
    'anger',
    'contempt',
    'nomal',
    'question',
    'recognize',
    'sad',
    'sleepy',
    'smile',
]

function sampleBgColor(data, width, height, channels) {
    const samples = []
    const points = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
        [Math.floor(width / 2), 0],
        [0, Math.floor(height / 2)],
    ]
    for (const [x, y] of points) {
        const i = (y * width + x) * channels
        samples.push([data[i], data[i + 1], data[i + 2]])
    }
    const r = Math.round(samples.reduce((s, p) => s + p[0], 0) / samples.length)
    const g = Math.round(samples.reduce((s, p) => s + p[1], 0) / samples.length)
    const b = Math.round(samples.reduce((s, p) => s + p[2], 0) / samples.length)
    return { r, g, b }
}

function colorDist(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

async function removeBackgroundBuffer(inputPath) {
    const { data, info } = await sharp(inputPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })

    const { width, height, channels } = info
    const bg = sampleBgColor(data, width, height, channels)
    const threshold = 48
    const soft = 18

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * channels
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const dist = colorDist(r, g, b, bg.r, bg.g, bg.b)

            let alpha = 255
            if (dist <= threshold - soft) {
                alpha = 0
            } else if (dist < threshold + soft) {
                const t = (dist - (threshold - soft)) / (2 * soft)
                alpha = Math.round(Math.min(1, Math.max(0, t)) * 255)
            }
            data[i + 3] = alpha
        }
    }

    return sharp(data, { raw: { width, height, channels: 4 } })
        .trim({ threshold: 10 })
        .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
}

async function processOne(name) {
    const input = path.join(MASCORT_DIR, `${name}.png`)
    const base = await removeBackgroundBuffer(input)

    await base
        .clone()
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(path.join(MASCORT_DIR, `${name}.png`))

    await sharp(path.join(MASCORT_DIR, `${name}.png`))
        .webp({ quality: 85, alphaQuality: 90, effort: 6 })
        .toFile(path.join(MASCORT_DIR, `${name}.webp`))

    const meta = await sharp(path.join(MASCORT_DIR, `${name}.png`)).metadata()
    console.log(`  ${name}: ${meta.width}x${meta.height}`)
}

async function main() {
    await mkdir(SOURCE_DIR, { recursive: true })

    for (const name of EMOTIONS) {
        const src = path.join(MASCORT_DIR, `${name}.png`)
        const backup = path.join(SOURCE_DIR, `${name}.png`)
        try {
            await copyFile(src, backup)
        } catch {
            console.warn(`skip backup ${name}`)
        }
    }

    console.log('Processing mascort (bg remove + resize + webp)...')
    for (const name of EMOTIONS) {
        await processOne(name)
    }
    console.log('Done.')
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
