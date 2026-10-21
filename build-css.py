#!/usr/bin/env python3
"""Build a compact public stylesheet from the editable CSS source files."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SOURCES = ['styles.css', 'design-system.css', 'responsive.css', 'layout-system.css']
OUTPUT = ROOT / 'site.min.css'


def strip_comments(text: str) -> str:
    """Remove CSS comments while preserving quoted strings and escaped characters."""
    out = []
    i = 0
    quote = None
    while i < len(text):
        ch = text[i]
        if quote:
            out.append(ch)
            if ch == '\\' and i + 1 < len(text):
                i += 1
                out.append(text[i])
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch in ('"', "'"):
            quote = ch
            out.append(ch)
            i += 1
            continue
        if ch == '/' and i + 1 < len(text) and text[i + 1] == '*':
            end = text.find('*/', i + 2)
            if end == -1:
                raise ValueError('Unclosed CSS comment')
            i = end + 2
            continue
        out.append(ch)
        i += 1
    return ''.join(out)


def compact(text: str) -> str:
    text = strip_comments(text)
    out = []
    i = 0
    quote = None
    while i < len(text):
        ch = text[i]
        if quote:
            out.append(ch)
            if ch == '\\' and i + 1 < len(text):
                i += 1
                out.append(text[i])
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch in ('"', "'"):
            quote = ch
            out.append(ch)
            i += 1
            continue
        if ch.isspace():
            j = i + 1
            while j < len(text) and text[j].isspace():
                j += 1
            prev = out[-1] if out else ''
            nxt = text[j] if j < len(text) else ''
            # Spaces adjacent to CSS punctuation are generally optional. Keep a
            # normal space between identifiers (e.g. selector descendant / @media).
            if prev in '{},:;>' or nxt in '{},:;>':
                pass
            elif prev == '' or nxt == '':
                pass
            else:
                out.append(' ')
            i = j
            continue
        out.append(ch)
        i += 1
    result = ''.join(out)
    result = re.sub(r';}', '}', result)
    return result.strip()


combined = '\n'.join((ROOT / item).read_text(encoding='utf-8') for item in SOURCES)
minified = compact(combined)
# CSS syntax is checked separately with tinycss2 during the QA workflow.
OUTPUT.write_text(minified + '\n', encoding='utf-8')
print(f'Built {OUTPUT.name}: {len(combined.encode())} -> {len(minified.encode())} bytes')
