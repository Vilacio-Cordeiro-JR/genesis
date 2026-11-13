#!/usr/bin/env python3
import os
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "genesis-production.zip"

EXCLUDED_DIRS = {"node_modules", "dist", "build", ".git", ".vercel", ".vite", "coverage", ".cache"}
EXCLUDED_FILES = {".DS_Store", "Thumbs.db"}
EXCLUDED_SUFFIXES = {".zip", ".log", ".tsbuildinfo"}


def is_excluded(path: Path) -> bool:
    name = path.name
    if name in EXCLUDED_FILES or path.suffix in EXCLUDED_SUFFIXES:
        return True
    return name == ".env" or (name.startswith(".env.") and name != ".env.example")


def collect() -> list[Path]:
    files: list[Path] = []
    for current, dirs, names in os.walk(ROOT):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDED_DIRS)
        for name in sorted(names):
            path = Path(current) / name
            if not is_excluded(path):
                files.append(path)
    return files


def print_tree(files: list[Path]) -> None:
    print(f"{ROOT.name}/")
    seen: set[Path] = set()
    for path in files:
        parts = path.relative_to(ROOT).parts
        for depth in range(1, len(parts)):
            folder = Path(*parts[:depth])
            if folder not in seen:
                seen.add(folder)
                print(f"{'  ' * depth}{parts[depth - 1]}/")
        print(f"{'  ' * len(parts)}{parts[-1]}")


def main() -> None:
    files = collect()
    print_tree(files)
    with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            archive.write(path, Path(ROOT.name) / path.relative_to(ROOT))
    size_kb = OUTPUT.stat().st_size / 1024
    print(f"\n{len(files)} arquivos -> {OUTPUT} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
