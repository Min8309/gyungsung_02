#!/usr/bin/env python3
"""Build a self-contained HTTP game ZIP without copying sources into the repository."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]


def package(output):
    if output.exists():
        raise SystemExit(f'출력 파일이 이미 있습니다: {output}')
    entries = {}
    for folder in ('sikjasil', 'mobile-expansion'):
        for path in sorted((ROOT / folder).rglob('*')):
            if not path.is_file() or path.suffix in ('.md', '.txt'):
                continue
            name = path.relative_to(ROOT / 'sikjasil') if folder == 'sikjasil' else path.relative_to(ROOT)
            data = path.read_bytes()
            if path.suffix in ('.html', '.js', '.css', '.webmanifest'):
                text = data.decode('utf-8').replace('../mobile-expansion/', './mobile-expansion/')
                if name.as_posix() == 'pwa-install.js':
                    text = text.replace('../game-pwa-sw.js', './game-pwa-sw.js')
                data = text.encode('utf-8')
            entries[name.as_posix()] = data
    worker = (ROOT / 'game-pwa-sw.js').read_text().replace("new URL('./sikjasil/',", "new URL('./',")
    entries['game-pwa-sw.js'] = worker.encode('utf-8')
    output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(output, 'w', compression=ZIP_DEFLATED) as archive:
        for name, data in entries.items():
            archive.writestr(name, data)
    print(f'{output}: {len(entries)}개 파일, {output.stat().st_size:,} bytes')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    package(parser.parse_args().output.resolve())
