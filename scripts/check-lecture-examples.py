"""Execute complete code files printed in the lecture explanations."""
import json
import os
import re
from pathlib import Path
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
examples = json.loads((root / "docs/lecture-code-examples.json").read_text(encoding="utf-8"))
results = []
environment = os.environ.copy()
environment["PYTHONPATH"] = str(root / "examples")
environment["PYTHONIOENCODING"] = "utf-8"
with tempfile.TemporaryDirectory(prefix="ptpm-lecture-examples-") as temp:
    for index, example in enumerate(examples):
        filename = f"lecture_example_{index}.py"
        (Path(temp) / filename).write_text(example["code"] + "\n", encoding="utf-8")
        is_test = "unittest.TestCase" in example["code"]
        command = [sys.executable, "-m", "unittest", filename[:-3], "-v"] if is_test else [sys.executable, filename]
        run = subprocess.run(command, cwd=temp, env=environment, capture_output=True, text=True, encoding="utf-8", timeout=20)
        assert run.returncode == 0, (example["key"], run.stderr)
        if is_test:
            assert "Ran 1 test" in run.stderr and "\nOK" in run.stderr, example["key"]
        else:
            assert run.stdout.strip() == "2000", example["key"]
        results.append({"key": example["key"], "returncode": run.returncode, "output": run.stdout + run.stderr})
run = subprocess.run([sys.executable, "report_demo.py"], cwd=root / "examples", env=environment, capture_output=True, text=True, encoding="utf-8", timeout=20)
assert run.returncode == 1
assert all(fragment in run.stderr for fragment in ["Ran 4 tests", "failures=1", "errors=1", "skipped=1", "AssertionError: 300 != 0", "TypeError: source must be callable"])
course = json.loads((root / "public/course.json").read_text(encoding="utf-8"))
report = next(s for l in course["lectures"] for s in l["slides"] if s["id"] == "s05-03-suite-quality-s011")
printed = report["visual"]["parts"][0]["code"]
actual_line = re.search(r'File "[^"\n]*report_demo.py", line (\d+), in test_wrong_price', run.stderr).group(1)
assert f'line {actual_line}, in test_wrong_price' in printed
assert 'Ran 4 tests' in printed and 'failures=1, errors=1, skipped=1' in printed
results.append({"key": "report-demo", "returncode": 1, "intentionalFailure": True, "output": run.stdout + run.stderr})
if "--output" in sys.argv:
    destination = Path(sys.argv[sys.argv.index("--output") + 1])
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Verified {len(examples)} complete lecture examples and the four-outcome report demonstration")
