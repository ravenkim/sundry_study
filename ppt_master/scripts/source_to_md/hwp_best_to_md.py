#!/usr/bin/env python3
"""
HWP/HWPX → best Markdown: runs up to three pipelines and scores the results.

1. pyhwp2md — native parser (text/표 중심)
2. HWP → DOCX (LibreOffice) → doc_to_md._convert_docx (mammoth, 그림·구조)
3. HWP → PDF (LibreOffice) → pdf_to_md.extract_pdf_to_markdown (PyMuPDF, 레이아웃·누락 완화)

Picks the highest quality score, relocates <stem>_files next to the output .md,
and rewrites image paths. LibreOffice is optional: without it, native-only is used.
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
from typing import Any

# Ensure sibling converters resolve when this module is imported in isolation
_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))


CANDIDATE = {
    "direct": "pyhwp2md",
    "docx": "HWP→DOCX (LibreOffice) + mammoth",
    "pdf": "HWP→PDF (LibreOffice) + PyMuPDF",
}


def _find_soffice() -> str | None:
    for name in ("soffice", "libreoffice"):
        w = shutil.which(name)
        if w:
            return w
    # macOS app bundle
    mac = Path("/Applications/LibreOffice.app/Contents/MacOS/soffice")
    if mac.is_file():
        return str(mac)
    # common Windows install paths
    for win in (
        Path(r"C:\Program Files\LibreOffice\program\soffice.exe"),
        Path(r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"),
    ):
        if win.is_file():
            return str(win)
    return None


def _lo_convert(soffice: str, input_path: Path, outdir: Path, to_filter: str) -> Path | None:
    """
    to_filter: 'pdf' or 'docx' (LibreOffice -convert-to).
    Produces <stem>.<ext> under outdir.
    """
    outdir = outdir.resolve()
    outdir.mkdir(parents=True, exist_ok=True)
    cmd = [
        soffice,
        "--headless",
        "--nologo",
        "--nolockcheck",
        "--nodefault",
        "--invisible",
        "--convert-to",
        to_filter,
        "--outdir",
        str(outdir),
        str(input_path.resolve()),
    ]
    try:
        r = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,
        )
    except (subprocess.TimeoutExpired, OSError, FileNotFoundError):
        return None
    if r.returncode != 0:
        return None
    ext = ".docx" if to_filter == "docx" else f".{to_filter}"
    expected = outdir / f"{input_path.stem}{ext}"
    if expected.is_file() and expected.stat().st_size > 0:
        return expected
    return None


def _markdown_score(text: str) -> float:
    """Larger = more usable slide/source MD (heuristic)."""
    t = (text or "").strip()
    if len(t) < 40:
        return -1.0
    lines = [ln for ln in t.splitlines() if ln.strip()]
    score = len(t) * 0.00025
    score += t.count("![") * 3.0
    score += t.count("|") * 1.2
    score += sum(1 for ln in lines if re.match(r"^#{1,6}\s", ln)) * 1.5
    score += len(lines) * 0.12
    # Slight lean toward not mostly whitespace / single chars
    alnum = sum(1 for c in t if c.isalnum())
    if alnum < len(t) * 0.1:
        score -= 2.0
    return score


def _path_rank(kind: str) -> int:
    # Tie: prefer mammoth (docx) over PDF text boxes over direct parser
    return {"docx": 2, "pdf": 1, "direct": 0}.get(kind, 0)


def _load_pyhwp2md(src: Path, out_md: Path) -> bool:
    try:
        from pyhwp2md import convert as hwp_convert
    except ImportError:
        return False
    out_md.parent.mkdir(parents=True, exist_ok=True)
    try:
        hwp_convert(str(src.resolve()), output_path=str(out_md.resolve()))
    except Exception as e:  # noqa: BLE001 - pyhwp2md raises several types
        print(f"   [HWP] pyhwp2md: {e}")
    return out_md.is_file() and out_md.stat().st_size > 0


def _import_docx_inner(docx: Path, out_md: Path) -> bool:
    import doc_to_md as dtm

    body = dtm._convert_docx(docx, out_md)
    return bool(body.strip()) and out_md.is_file()


def _import_pdf_inner(pdf: Path, out_md: Path) -> bool:
    import pdf_to_md as ptm

    s = ptm.extract_pdf_to_markdown(str(pdf), str(out_md))
    return bool(s.strip()) and out_md.is_file()


def _reparent_assets(
    markdown: str,
    old_stem: str,
    new_stem: str,
    old_dir: Path | None,
    parent: Path,
) -> str:
    old_prefix = f"{old_stem}_files"
    new_dir = parent / f"{new_stem}_files"
    if old_dir and old_dir.is_dir():
        if new_dir.exists():
            shutil.rmtree(new_dir)
        shutil.copytree(old_dir, new_dir)
    return markdown.replace(old_prefix, f"{new_stem}_files")


def convert_hwp_best(src: Path, out_file: Path) -> str:
    """
    Run direct / DOCX / PDF paths when possible, pick the best-scoring MD,
    write to out_file, return text.
    """
    if not src.is_file():
        print(f"[ERROR] File not found: {src}")
        return ""

    out_file = out_file.resolve()
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_stem = out_file.stem
    out_parent = out_file.parent

    soffice = _find_soffice()
    if soffice:
        print(
            f"[INFO] HWP: LibreOffice found → will try PDF & DOCX routes, "
            f"plus native pyhwp2md"
        )
    else:
        print(
            "[INFO] HWP: LibreOffice not in PATH (optional). "
            "Install for HWP→PDF / HWP→DOCX routes; using native + any available only."
        )

    candidates: list[dict[str, Any]] = []

    with tempfile.TemporaryDirectory(prefix="hwpbest_") as tmp:
        tdir = Path(tmp)
        sid = uuid.uuid4().hex[:8]
        work = tdir / f"input{src.suffix}"
        try:
            shutil.copy2(src, work)
        except OSError as e:
            print(f"[ERROR] Could not copy input to temp: {e}")
            return ""

        c_direct = tdir / f"c_{sid}_direct.md"
        if _load_pyhwp2md(work, c_direct):
            txt = c_direct.read_text(encoding="utf-8", errors="replace")
            sc = _markdown_score(txt)
            print(f"   [HWP] {CANDIDATE['direct']}: score={sc:.1f} ({len(txt)} chars)")
            candidates.append(
                {
                    "kind": "direct",
                    "score": sc,
                    "md_path": c_direct,
                    "stem": c_direct.stem,
                    "files_dir": c_direct.parent / f"{c_direct.stem}_files"
                    if (c_direct.parent / f"{c_direct.stem}_files").is_dir()
                    else None,
                    "raw": txt,
                }
            )

        if soffice:
            pdir = tdir / "lo_pdf"
            pdf_path = _lo_convert(soffice, work, pdir, "pdf")
            if pdf_path:
                c_pdf = tdir / f"c_{sid}_pdf.md"
                if _import_pdf_inner(pdf_path, c_pdf):
                    txt = c_pdf.read_text(encoding="utf-8", errors="replace")
                    sc = _markdown_score(txt)
                    fdir = c_pdf.parent / f"{c_pdf.stem}_files"
                    print(
                        f"   [HWP] {CANDIDATE['pdf']}: score={sc:.1f} ({len(txt)} chars)"
                    )
                    candidates.append(
                        {
                            "kind": "pdf",
                            "score": sc,
                            "md_path": c_pdf,
                            "stem": c_pdf.stem,
                            "files_dir": fdir if fdir.is_dir() else None,
                            "raw": txt,
                        }
                    )
            else:
                print("   [HWP] HWP→PDF: LibreOffice did not produce a PDF (no HWP filter or error)")

            ddir = tdir / "lo_docx"
            docx_path = _lo_convert(soffice, work, ddir, "docx")
            if docx_path:
                c_docx = tdir / f"c_{sid}_docx.md"
                if _import_docx_inner(docx_path, c_docx):
                    txt = c_docx.read_text(encoding="utf-8", errors="replace")
                    sc = _markdown_score(txt)
                    fdir = c_docx.parent / f"{c_docx.stem}_files"
                    print(
                        f"   [HWP] {CANDIDATE['docx']}: score={sc:.1f} ({len(txt)} chars)"
                    )
                    candidates.append(
                        {
                            "kind": "docx",
                            "score": sc,
                            "md_path": c_docx,
                            "stem": c_docx.stem,
                            "files_dir": fdir if fdir.is_dir() else None,
                            "raw": txt,
                        }
                    )
            else:
                print(
                    "   [HWP] HWP→DOCX: LibreOffice did not produce DOCX (no filter or error)"
                )

        if not candidates:
            print(
                "[ERROR] All HWP conversion paths failed. "
                "Install: pip install pyhwp2md"
            )
            print(
                "   (Optional) Add LibreOffice with a HWP import filter for PDF/DOCX routes."
            )
            return ""

        def _key(c: dict) -> tuple[float, int]:
            return (c.get("score", -999.0), _path_rank(c.get("kind", "direct")))

        best = max(candidates, key=_key)
        for c in candidates:
            if c is best:
                mark = " ← chosen"
            else:
                mark = ""
            k = c.get("kind", "direct")
            label = CANDIDATE.get(k, k)
            print(
                f"   [HWP] {label}: final score={c.get('score', 0):.1f}{mark}"
            )

        if best.get("score", 0) < 0 and len(candidates) > 1:
            best = max(
                candidates,
                key=lambda c: (len(c.get("raw", "") or ""), _key(c)),
            )
            print(
                f"   [HWP] All scores were low; choosing longest text path ({best.get('kind')})"
            )

        # Copy assets while temp (files_dir) still exists
        raw = best.get("raw") or ""
        old_stem = str(best.get("stem", ""))
        fdir: Path | None = best.get("files_dir")
        if isinstance(fdir, Path) and not fdir.is_dir():
            fdir = None
        if old_stem and raw:
            final = _reparent_assets(raw, old_stem, out_stem, fdir, out_parent)
        else:
            final = raw
        out_file.write_text(final, encoding="utf-8")

    final_media = out_parent / f"{out_stem}_files"
    mlen = 0
    if final_media.is_dir():
        mlen = len([f for f in final_media.rglob("*") if f.is_file()])

    kind = best.get("kind", "direct")
    if kind not in CANDIDATE:
        kind = "direct"
    print(
        f"[OK] Best HWP route: {CANDIDATE[kind]}"
        f" — saved: {out_file} ({len(final):,} chars"
        f"{f', {mlen} media' if mlen else ''})"
    )
    return out_file.read_text(encoding="utf-8")


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser(description=__doc__.split("Picks the")[0].strip())
    p.add_argument("input", type=Path, help="Path to .hwp or .hwpx")
    p.add_argument(
        "-o", "--output", type=Path, help="Output .md (default: next to input)"
    )
    args = p.parse_args()
    inp = args.input.expanduser().resolve()
    out = args.output or inp.with_suffix(".md")
    sys.exit(0 if convert_hwp_best(inp, out).strip() else 1)
