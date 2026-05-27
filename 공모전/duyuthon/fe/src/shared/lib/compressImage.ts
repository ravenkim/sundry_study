import i18n from 'src/assets/locales/i18n'

const DEFAULT_MAX_EDGE = 1920
const DEFAULT_QUALITY = 0.85
const DEFAULT_MAX_BYTES = 1.5 * 1024 * 1024

type CompressImageOptions = {
    maxEdge?: number
    quality?: number
    maxBytes?: number
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const image = new Image()

        image.onload = () => {
            URL.revokeObjectURL(url)
            resolve(image)
        }
        image.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error(i18n.t('errors:imageLoadFailed')))
        }
        image.src = url
    })
}

function canvasToBlob(
    canvas: HTMLCanvasElement,
    quality: number,
): Promise<Blob | null> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
    })
}

function scaleDimensions(
    width: number,
    height: number,
    maxEdge: number,
): { width: number; height: number } {
    const longestEdge = Math.max(width, height)
    if (longestEdge <= maxEdge) {
        return { width, height }
    }

    const ratio = maxEdge / longestEdge
    return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
    }
}

export async function compressImageForUpload(
    file: File,
    options: CompressImageOptions = {},
): Promise<File> {
    const maxEdge = options.maxEdge ?? DEFAULT_MAX_EDGE
    const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES
    let quality = options.quality ?? DEFAULT_QUALITY

    if (!file.type.startsWith('image/')) {
        return file
    }

    const image = await loadImageFromFile(file)
    const { width, height } = scaleDimensions(
        image.naturalWidth,
        image.naturalHeight,
        maxEdge,
    )

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
        return file
    }

    context.drawImage(image, 0, 0, width, height)

    let blob = await canvasToBlob(canvas, quality)
    if (!blob) {
        return file
    }

    while (blob.size > maxBytes && quality > 0.5) {
        quality -= 0.1
        blob = (await canvasToBlob(canvas, quality)) ?? blob
    }

    if (blob.size >= file.size && file.type === 'image/jpeg') {
        return file
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'report'
    return new File([blob], `${baseName}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
    })
}
