"""Rebuild or verify the downloadable teaching examples."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
files = sorted((root / 'examples').glob('*.py')) + [root / 'examples/README.md']
archive = root / 'public/downloads/ptpm-examples.zip'
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
def content(path):
    return path.read_bytes().replace(b'\r\n', b'\n')

if args.check:
    with ZipFile(archive) as zipped:
        assert not zipped.testzip()
        assert set(zipped.namelist()) == {'examples/' + p.name for p in files}
        for path in files:
            assert zipped.read('examples/' + path.name) == content(path), path.name
    print('Downloadable examples match the source files')
else:
    archive.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(archive, 'w', ZIP_DEFLATED) as zipped:
        for path in files:
            info = ZipInfo('examples/' + path.name, date_time=(2026, 10, 26, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            zipped.writestr(info, content(path))
    print('Rebuilt public/downloads/ptpm-examples.zip')
