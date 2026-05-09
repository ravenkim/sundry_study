import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ArrowLeft,
    Plus,
    Sparkles,
    Star,
    Trash2,
    Wine,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'src/shared/lib/shadcn/components/ui/card.tsx'
import { Button } from 'src/shared/lib/shadcn/components/ui/button.tsx'
import { Input } from 'src/shared/lib/shadcn/components/ui/input.tsx'
import { Label } from 'src/shared/lib/shadcn/components/ui/label.tsx'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from 'src/shared/lib/shadcn/components/ui/sheet.tsx'
import { toast } from 'react-toastify'
import { cn } from 'src/shared/lib/shadcn/lib/utils.ts'

const STORAGE_KEY = 'gdg-bar-tasting-notes-v1'

type DrinkCategory = '위스키' | '버번' | '맥주' | '와인' | '막걸리' | '기타'

const DRINK_CATEGORIES: DrinkCategory[] = [
    '위스키',
    '버번',
    '맥주',
    '와인',
    '막걸리',
    '기타',
]

export type TastingNote = {
    id: string
    drinkName: string
    category: DrinkCategory
    rating: number
    /** 테이스팅 레이더(다각형) 축 — 미입력 시 저장 시 `rating`으로 채움 */
    noseScore: number
    palateScore: number
    finishScore: number
    bodyScore: number
    complexityScore: number
    aroma: string
    taste: string
    finish: string
    comment: string
    distillery: string
    ageStatement: string
    caskType: string
    whiskyRegion: string
    bartenderComment: string
    createdAt: string
}

const PROFILE_MAX = 5

const RADAR_AXES = [
    { key: 'noseScore' as const, label: '향', short: '향' },
    { key: 'palateScore' as const, label: '맛', short: '맛' },
    { key: 'finishScore' as const, label: '피니시', short: '피니' },
    { key: 'bodyScore' as const, label: '바디', short: '바디' },
    { key: 'complexityScore' as const, label: '복합성', short: '복합' },
] as const

function migrateLoadedNote(n: TastingNote): TastingNote {
    const r = n.rating
    return {
        ...n,
        noseScore: n.noseScore ?? r,
        palateScore: n.palateScore ?? r,
        finishScore: n.finishScore ?? r,
        bodyScore: n.bodyScore ?? r,
        complexityScore: n.complexityScore ?? r,
    }
}

function profileAxesForNote(n: TastingNote) {
    return RADAR_AXES.map(({ key, label }) => ({
        label,
        value: clampProfile(n[key]),
    }))
}

function profileAxesForForm(f: {
    rating: number
    noseScore: number
    palateScore: number
    finishScore: number
    bodyScore: number
    complexityScore: number
}) {
    const r = f.rating
    return RADAR_AXES.map(({ key, label }) => ({
        label,
        value: clampProfile(f[key] || r),
    }))
}

function clampProfile(v: number) {
    if (!Number.isFinite(v)) return 0
    return Math.min(PROFILE_MAX, Math.max(0, v))
}

function loadNotes(): TastingNote[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return []
        return (parsed as TastingNote[]).map(migrateLoadedNote)
    } catch {
        return []
    }
}

function persistNotes(notes: TastingNote[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {
        toast.error('저장 공간을 사용할 수 없습니다.')
    }
}

function makeBartenderComment(note: TastingNote): string {
    const { rating, category, whiskyRegion, comment } = note
    const region = whiskyRegion?.trim()
    if (rating >= 5) {
        return region
            ? `${region} 쪽을 참 좋아하시는 것 같아요. 오늘 밤도 기분 좋은 한 잔이 되셨길 바라요.`
            : '점수가 아주 후한데요, 오늘 테이블 가장 밝은 손님 같아요.'
    }
    if (rating <= 2) {
        return '취향에 안 맞을 수도 있죠. 다음엔 한 단계 가벼운 쪽을 골라 볼까요?'
    }
    if (category === '위스키' || category === '버번') {
        return region
            ? `${region} 라인을 차근히 탐험 중이시네요. 노트에 적어 두신 향이 다음 선택에 도움이 될 거예요.`
            : '한 모금씩 기록해 두시는 편이, 취향이 잡히는 데 정말 도움이 돼요.'
    }
    return comment?.trim()
        ? '한 줄 감상까지 남겨 주셔서 기록이 살아 있네요.'
        : '술 이름만으로도 나중에 분위기가 떠오르곤 해요. 언제든 다시 펼쳐 보세요.'
}

type SheetMode = 'closed' | 'create' | 'view'

const emptyForm = {
    drinkName: '',
    category: '위스키' as DrinkCategory,
    rating: 0,
    noseScore: 0,
    palateScore: 0,
    finishScore: 0,
    bodyScore: 0,
    complexityScore: 0,
    aroma: '',
    taste: '',
    finish: '',
    comment: '',
    distillery: '',
    ageStatement: '',
    caskType: '',
    whiskyRegion: '',
}

function StarRow({
    value,
    onChange,
    readOnly,
    size = 'md',
}: {
    value: number
    onChange?: (n: number) => void
    readOnly?: boolean
    size?: 'sm' | 'md'
}) {
    const starSz = size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChange?.(n)}
                    className={cn(
                        'p-0.5 transition-transform',
                        !readOnly && 'hover:scale-110',
                        readOnly && 'cursor-default',
                    )}
                    aria-label={`별점 ${n}`}
                >
                    <Star
                        className={cn(
                            starSz,
                            n <= value
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground/40',
                        )}
                    />
                </button>
            ))}
        </div>
    )
}

function TastingRadarChart({
    axes,
    className,
    showLabels = true,
    labelMode = 'full',
}: {
    axes: { label: string; value: number }[]
    className?: string
    showLabels?: boolean
    labelMode?: 'full' | 'short'
}) {
    const n = axes.length
    if (n < 3) return null

    const cx = 50
    const cy = 50
    const rData = 34
    const rGrid = 34
    const labelOffset = 11

    const angleAt = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n

    const vertex = (i: number, radius: number) => {
        const a = angleAt(i)
        return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const
    }

    const ringT = [0.25, 0.5, 0.75, 1]
    const gridPolys = ringT.map((t) =>
        axes
            .map((_, i) => {
                const [x, y] = vertex(i, rGrid * t)
                return `${x},${y}`
            })
            .join(' '),
    )

    const dataPoly = axes
        .map((axis, i) => {
            const t = clampProfile(axis.value) / PROFILE_MAX
            const [x, y] = vertex(i, rData * t)
            return `${x},${y}`
        })
        .join(' ')

    const source = RADAR_AXES.map((meta, i) => ({
        short: meta.short,
        full: meta.label,
        i,
    }))

    return (
        <svg
            viewBox="0 0 100 100"
            className={cn('aspect-square w-full', className)}
            aria-hidden
        >
            {gridPolys.map((points, idx) => (
                <polygon
                    key={idx}
                    points={points}
                    fill="none"
                    className="stroke-border text-border"
                    strokeWidth={0.35}
                    opacity={0.85}
                />
            ))}
            {axes.map((_, i) => {
                const [x1, y1] = vertex(i, 0)
                const [x2, y2] = vertex(i, rGrid)
                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className="stroke-border"
                        strokeWidth={0.35}
                        opacity={0.75}
                    />
                )
            })}
            <polygon
                points={dataPoly}
                className="fill-primary/20 stroke-primary"
                strokeWidth={1.2}
                strokeLinejoin="round"
            />
            {showLabels
                ? source.slice(0, n).map((meta) => {
                      const [lx, ly] = vertex(
                          meta.i,
                          rGrid + labelOffset,
                      )
                      const text =
                          labelMode === 'short' ? meta.short : meta.full
                      return (
                          <text
                              key={meta.i}
                              x={lx}
                              y={ly}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className="fill-muted-foreground font-sans uppercase"
                              style={{ fontSize: labelMode === 'short' ? 7 : 6.5 }}
                          >
                              {text}
                          </text>
                      )
                  })
                : null}
        </svg>
    )
}

function formatDate(iso: string) {
    try {
        const d = new Date(iso)
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    } catch {
        return ''
    }
}

const NotePage = () => {
    const navigate = useNavigate()
    const [notes, setNotes] = useState<TastingNote[]>(() => loadNotes())
    const [filter, setFilter] = useState<'전체' | DrinkCategory>('전체')
    const [sheetMode, setSheetMode] = useState<SheetMode>('closed')
    const [selected, setSelected] = useState<TastingNote | null>(null)
    const [form, setForm] = useState(emptyForm)

    useEffect(() => {
        persistNotes(notes)
    }, [notes])

    const filtered = useMemo(() => {
        const list =
            filter === '전체'
                ? notes
                : notes.filter((n) => n.category === filter)
        return [...list].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
    }, [notes, filter])

    const whiskeyCount = useMemo(
        () =>
            notes.filter(
                (n) => n.category === '위스키' || n.category === '버번',
            ).length,
        [notes],
    )

    const preferenceHint = useMemo(() => {
        if (whiskeyCount < 5) return null
        const regions = notes
            .filter(
                (n) =>
                    (n.category === '위스키' || n.category === '버번') &&
                    n.whiskyRegion?.trim(),
            )
            .map((n) => n.whiskyRegion!.trim())
        if (regions.length === 0) {
            return {
                title: '기록이 쌓이고 있어요',
                body: '지역이나 스타일을 가끔 적어 두시면, 취향이 한눈에 보여요.',
            }
        }
        const count: Record<string, number> = {}
        for (const r of regions) {
            count[r] = (count[r] ?? 0) + 1
        }
        const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
        return {
            title: `${top[0]} 계열 기록이 많아요`,
            body: '비슷한 라인을 더 찾아보셔도 좋을 것 같아요, 단골손님.',
        }
    }, [notes, whiskeyCount])

    const openCreate = useCallback(() => {
        setForm(emptyForm)
        setSelected(null)
        setSheetMode('create')
    }, [])

    const openView = useCallback((n: TastingNote) => {
        setSelected(n)
        setSheetMode('view')
    }, [])

    const closeSheet = useCallback(() => {
        setSheetMode('closed')
        setSelected(null)
    }, [])

    const handleSave = useCallback(() => {
        if (!form.drinkName.trim()) {
            toast.warning('술 이름을 입력해 주세요.')
            return
        }
        if (form.rating < 1) {
            toast.warning('별점을 선택해 주세요.')
            return
        }
        const r = form.rating
        const newNote: TastingNote = {
            id: crypto.randomUUID(),
            drinkName: form.drinkName.trim(),
            category: form.category,
            rating: form.rating,
            noseScore: form.noseScore || r,
            palateScore: form.palateScore || r,
            finishScore: form.finishScore || r,
            bodyScore: form.bodyScore || r,
            complexityScore: form.complexityScore || r,
            aroma: form.aroma.trim(),
            taste: form.taste.trim(),
            finish: form.finish.trim(),
            comment: form.comment.trim(),
            distillery: form.distillery.trim(),
            ageStatement: form.ageStatement.trim(),
            caskType: form.caskType.trim(),
            whiskyRegion: form.whiskyRegion.trim(),
            bartenderComment: '',
            createdAt: new Date().toISOString(),
        }
        newNote.bartenderComment = makeBartenderComment(newNote)
        setNotes((prev) => [newNote, ...prev])
        toast.success('테이스팅 노트를 남겼어요.')
        closeSheet()
    }, [form, closeSheet])

    const handleDelete = useCallback(
        (id: string) => {
            setNotes((prev) => prev.filter((n) => n.id !== id))
            toast.info('노트를 지웠어요.')
            closeSheet()
        },
        [closeSheet],
    )

    const showWhiskyFields =
        form.category === '위스키' || form.category === '버번'

    const sheetOpen = sheetMode !== 'closed'

    return (
        <div className="font-serif relative flex min-h-screen flex-col">
            <div className="sepia-overlay absolute inset-0 z-0 opacity-50" />

            <header className="border-border bg-background/90 fixed top-0 z-50 w-full border-b backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6 sm:py-4">
                    <button
                        type="button"
                        onClick={() =>
                            window.history.length > 1
                                ? navigate(-1)
                                : navigate('/')
                        }
                        className="group flex flex-col items-center transition-transform hover:scale-105"
                        aria-label="뒤로가기"
                    >
                        <ArrowLeft className="text-primary group-hover:brightness-110 h-6 w-6" />
                        <span className="text-muted-foreground mt-1 font-sans text-[10px] tracking-wide md:text-xs">
                            뒤로가기
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="bg-primary text-primary-foreground group flex items-center gap-2 rounded-full px-4 py-2 shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="font-sans text-sm font-medium">
                            기록
                        </span>
                    </button>
                </div>
            </header>

            <main className="relative z-10 flex flex-grow flex-col px-5 pb-12 pt-24 sm:px-6">
                <div className="mx-auto w-full max-w-2xl">
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                        {(['전체', ...DRINK_CATEGORIES] as const).map(
                            (cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFilter(cat)}
                                    className={cn(
                                        'font-sans shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors md:text-sm',
                                        filter === cat
                                            ? 'border-primary bg-primary/15 text-primary'
                                            : 'border-border bg-card/80 text-muted-foreground hover:border-primary/50',
                                    )}
                                >
                                    {cat}
                                </button>
                            ),
                        )}
                    </div>

                    <AnimatePresence mode="popLayout">
                        {filtered.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-border bg-card/90 flex flex-col items-center rounded-2xl border p-10 text-center shadow-xl backdrop-blur-lg"
                            >
                                <Wine className="text-muted-foreground mb-4 h-12 w-12" />
                                <p className="text-muted-foreground font-sans text-sm">
                                    아직 남긴 노트가 없어요.
                                    <br />
                                    오늘 마신 한 잔을 적어 보시겠어요?
                                </p>
                                <Button
                                    type="button"
                                    className="mt-6 rounded-full"
                                    onClick={openCreate}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    노트 작성
                                </Button>
                            </motion.div>
                        ) : (
                            <ul className="flex flex-col gap-4">
                                {filtered.map((n) => (
                                    <motion.li
                                        key={n.id}
                                        layout
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => openView(n)}
                                            className="w-full text-left"
                                        >
                                            <Card className="border-border bg-card/95 hover:border-primary/40 transition-colors backdrop-blur-md">
                                                <CardHeader className="pb-2">
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                                                        <CardTitle className="text-primary font-display min-w-0 text-lg leading-snug sm:pr-2">
                                                            {n.drinkName}
                                                        </CardTitle>
                                                        <span className="text-muted-foreground font-sans text-xs whitespace-nowrap sm:shrink-0">
                                                            {formatDate(
                                                                n.createdAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <CardDescription className="flex flex-col gap-1.5 font-sans text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                                                        <span className="border-border w-fit shrink-0 rounded-full border px-2 py-0.5">
                                                            {n.category}
                                                        </span>
                                                        {n.whiskyRegion ? (
                                                            <span className="min-w-0 break-words">
                                                                {n.whiskyRegion}
                                                            </span>
                                                        ) : null}
                                                    </CardDescription>
                                                    <div className="flex flex-nowrap items-center justify-center gap-0.5 pt-1 sm:justify-start">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (s) => (
                                                                <span
                                                                    key={s}
                                                                    className="inline-flex shrink-0 items-center justify-center leading-none"
                                                                    aria-hidden
                                                                >
                                                                    <Star
                                                                        className={cn(
                                                                            'block h-4 w-4',
                                                                            s <=
                                                                                n.rating
                                                                                ? 'fill-primary text-primary'
                                                                                : 'fill-muted/30 text-muted-foreground/35',
                                                                        )}
                                                                    />
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2 pt-0">
                                                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
                                                        <div className="border-border/60 bg-muted/15 mx-auto w-full max-w-[10.5rem] shrink-0 rounded-lg border p-2 sm:mx-0 sm:w-[5.75rem] sm:max-w-none sm:p-1.5">
                                                            <TastingRadarChart
                                                                axes={profileAxesForNote(
                                                                    n,
                                                                )}
                                                                labelMode="short"
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1 space-y-2">
                                                            {n.comment ? (
                                                                <p className="text-card-foreground line-clamp-2 text-center text-sm sm:text-left">
                                                                    &ldquo;
                                                                    {
                                                                        n.comment
                                                                    }
                                                                    &rdquo;
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </AnimatePresence>

                    {preferenceHint ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-10"
                        >
                            <div className="text-muted-foreground mb-3 text-center font-sans text-xs tracking-widest">
                                ─── ✦ 취향 분석 ✦ ───
                            </div>
                            <Card className="border-primary/30 bg-card/90 backdrop-blur-lg">
                                <CardHeader>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <Sparkles className="text-primary h-5 w-5 shrink-0" />
                                        <CardTitle className="text-base leading-snug">
                                            {preferenceHint.title}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-card-foreground pt-1 text-sm leading-relaxed">
                                        {preferenceHint.body}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ) : null}
                </div>
            </main>

            <Sheet
                open={sheetOpen}
                onOpenChange={(o) => {
                    if (!o) closeSheet()
                }}
            >
                <SheetContent
                    side="bottom"
                    className="max-h-[92vh] overflow-y-auto rounded-t-2xl px-5 sm:px-6"
                >
                    {sheetMode === 'create' ? (
                        <>
                            <SheetHeader>
                                <SheetTitle className="font-display text-xl">
                                    노트 작성
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-4 pb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="drinkName">
                                        술 이름{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="drinkName"
                                        value={form.drinkName}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                drinkName: e.target.value,
                                            }))
                                        }
                                        placeholder="예: 글렌피딕 12년"
                                        className="font-sans"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>주종 *</Label>
                                    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch] flex-nowrap">
                                        {DRINK_CATEGORIES.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        category: c,
                                                    }))
                                                }
                                                className={cn(
                                                    'font-sans shrink-0 rounded-full border px-3 py-1 text-xs',
                                                    form.category === c
                                                        ? 'border-primary bg-primary/15 text-primary'
                                                        : 'border-border',
                                                )}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>별점 *</Label>
                                    <StarRow
                                        value={form.rating}
                                        onChange={(rating) =>
                                            setForm((f) => ({ ...f, rating }))
                                        }
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label>맛 프로필 차트</Label>
                                        <p className="text-muted-foreground font-sans text-xs leading-snug">
                                            오각형 그래프용 다섯 축이에요. 비우면
                                            전체 별점과 같게 저장돼요.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {RADAR_AXES.map(({ key, label }) => (
                                            <div key={key} className="space-y-1">
                                                <Label className="text-muted-foreground text-xs">
                                                    {label}
                                                </Label>
                                                <StarRow
                                                    size="sm"
                                                    value={form[key]}
                                                    onChange={(v) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            [key]: v,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-border/70 bg-card/40 flex justify-center rounded-xl border py-3">
                                        <div className="w-36 sm:w-44">
                                            <TastingRadarChart
                                                axes={profileAxesForForm(
                                                    form,
                                                )}
                                                labelMode="short"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-muted-foreground py-2 text-center font-sans text-xs tracking-widest">
                                    ─── ✦ 테이스팅 ✦ ───
                                </div>

                                {(
                                    [
                                        ['aroma', '향 (Nose)'],
                                        ['taste', '맛 (Palate)'],
                                        ['finish', '피니시 (Finish)'],
                                    ] as const
                                ).map(([key, label]) => (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={key}>{label}</Label>
                                        <textarea
                                            id={key}
                                            value={form[key]}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    [key]: e.target.value,
                                                }))
                                            }
                                            rows={3}
                                            className="border-input bg-background/50 placeholder:text-muted-foreground focus:border-primary font-serif shadow-inner w-full resize-y rounded-md border px-3 py-2 text-sm transition-all focus:outline-none"
                                        />
                                    </div>
                                ))}

                                {showWhiskyFields ? (
                                    <>
                                        <div className="text-muted-foreground py-2 text-center font-sans text-xs tracking-widest">
                                            <span className="inline-block whitespace-nowrap">
                                                ✦ 위스키 정보 ✦
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="distillery">
                                                    증류소
                                                </Label>
                                                <Input
                                                    id="distillery"
                                                    value={form.distillery}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            distillery:
                                                                e.target
                                                                    .value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="age">
                                                    숙성·연수
                                                </Label>
                                                <Input
                                                    id="age"
                                                    placeholder="예: 12년, NAS"
                                                    value={form.ageStatement}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            ageStatement:
                                                                e.target
                                                                    .value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cask">
                                                    캐스크
                                                </Label>
                                                <Input
                                                    id="cask"
                                                    placeholder="예: 셰리, 버번"
                                                    value={form.caskType}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            caskType:
                                                                e.target
                                                                    .value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="region">
                                                    스타일·지역
                                                </Label>
                                                <Input
                                                    id="region"
                                                    placeholder="스페이사이드, 아일라, 버번 등"
                                                    value={form.whiskyRegion}
                                                    onChange={(e) =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            whiskyRegion:
                                                                e.target
                                                                    .value,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : null}

                                <div className="space-y-2">
                                    <Label htmlFor="comment">
                                        한 줄 감상
                                    </Label>
                                    <textarea
                                        id="comment"
                                        value={form.comment}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                comment: e.target.value,
                                            }))
                                        }
                                        rows={2}
                                        className="border-input bg-background/50 placeholder:text-muted-foreground focus:border-primary font-serif shadow-inner w-full resize-y rounded-md border px-3 py-2 text-sm transition-all focus:outline-none"
                                    />
                                </div>
                            </div>

                            <SheetFooter className="flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full rounded-full"
                                    onClick={closeSheet}
                                >
                                    취소
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full rounded-full"
                                    onClick={handleSave}
                                >
                                    ◈ 기록 남기기 ◈
                                </Button>
                            </SheetFooter>
                        </>
                    ) : sheetMode === 'view' && selected ? (
                        <>
                            <SheetHeader>
                                <SheetTitle className="font-display pr-8 text-xl">
                                    {selected.drinkName}
                                </SheetTitle>
                                <div className="text-muted-foreground font-sans text-sm leading-snug">
                                    <span>
                                        {formatDate(selected.createdAt)} ·{' '}
                                        {selected.category}
                                    </span>
                                </div>
                            </SheetHeader>

                            <div className="space-y-4 pb-4">
                                <div className="flex flex-col items-center gap-4">
                                    <StarRow
                                        value={selected.rating}
                                        readOnly
                                    />
                                    <div className="border-border/70 bg-muted/15 w-full max-w-[min(100%,14rem)] rounded-xl border p-3">
                                        <p className="text-muted-foreground mb-2 text-center font-sans text-[10px] uppercase tracking-widest">
                                            맛 프로필
                                        </p>
                                        <TastingRadarChart
                                            axes={profileAxesForNote(selected)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-card/90 border-border rounded-xl border p-4">
                                    <h3 className="text-muted-foreground mb-2 font-sans text-xs uppercase tracking-wider">
                                        테이스팅
                                    </h3>
                                    <dl className="space-y-2 text-sm">
                                        <div>
                                            <dt className="text-muted-foreground font-sans text-xs">
                                                Nose
                                            </dt>
                                            <dd>{selected.aroma || '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground font-sans text-xs">
                                                Palate
                                            </dt>
                                            <dd>{selected.taste || '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground font-sans text-xs">
                                                Finish
                                            </dt>
                                            <dd>{selected.finish || '—'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {(selected.distillery ||
                                    selected.ageStatement ||
                                    selected.caskType ||
                                    selected.whiskyRegion) && (
                                    <div className="bg-card/90 border-border rounded-xl border p-4 text-sm">
                                        <h3 className="text-muted-foreground mb-3 font-sans text-xs uppercase tracking-wider">
                                            위스키 정보
                                        </h3>
                                        <dl className="space-y-3">
                                            {selected.distillery ? (
                                                <div>
                                                    <dt className="text-muted-foreground font-sans text-xs">
                                                        증류소
                                                    </dt>
                                                    <dd className="text-card-foreground break-words pt-0.5">
                                                        {selected.distillery}
                                                    </dd>
                                                </div>
                                            ) : null}
                                            {selected.ageStatement ? (
                                                <div>
                                                    <dt className="text-muted-foreground font-sans text-xs">
                                                        숙성·연수
                                                    </dt>
                                                    <dd className="text-card-foreground break-words pt-0.5">
                                                        {selected.ageStatement}
                                                    </dd>
                                                </div>
                                            ) : null}
                                            {selected.caskType ? (
                                                <div>
                                                    <dt className="text-muted-foreground font-sans text-xs">
                                                        캐스크
                                                    </dt>
                                                    <dd className="text-card-foreground break-words pt-0.5">
                                                        {selected.caskType}
                                                    </dd>
                                                </div>
                                            ) : null}
                                            {selected.whiskyRegion ? (
                                                <div>
                                                    <dt className="text-muted-foreground font-sans text-xs">
                                                        스타일·지역
                                                    </dt>
                                                    <dd className="text-card-foreground break-words pt-0.5">
                                                        {selected.whiskyRegion}
                                                    </dd>
                                                </div>
                                            ) : null}
                                        </dl>
                                    </div>
                                )}

                                {selected.comment ? (
                                    <p className="text-card-foreground text-sm italic">
                                        &ldquo;{selected.comment}&rdquo;
                                    </p>
                                ) : null}

                                <div className="relative">
                                    <div className="bg-card/90 border-border relative rounded-2xl border p-5 shadow-lg backdrop-blur-lg">
                                        <p className="text-primary font-display mb-2 text-sm font-semibold">
                                            바텐더 한마디
                                        </p>
                                        <p className="text-card-foreground text-sm leading-relaxed">
                                            {selected.bartenderComment}
                                        </p>
                                        <div className="border-border/40 bg-card absolute -bottom-2 left-6 h-4 w-4 rotate-45 border-r border-b" />
                                    </div>
                                </div>
                            </div>

                            <SheetFooter>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full rounded-full"
                                    onClick={() => handleDelete(selected.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    이 노트 삭제
                                </Button>
                            </SheetFooter>
                        </>
                    ) : null}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default NotePage
