"""Контролируемый учебный опыт, не изменяющий файлы модулей."""
import io
import unittest


def wrong_fee(amount):
    return 0 if amount > 3000 else 300


class WeakCheck(unittest.TestCase):
    def runTest(self):
        self.assertGreaterEqual(wrong_fee(3000), 0)


class StrongCheck(unittest.TestCase):
    def runTest(self):
        self.assertEqual(wrong_fee(3000), 0)


if __name__ == "__main__":
    results = []
    for check in [WeakCheck, StrongCheck]:
        log = io.StringIO()
        result = unittest.TextTestRunner(stream=log).run(check())
        results.append(result.wasSuccessful())
        print(check.__name__, "PASS" if result.wasSuccessful() else "FAIL")
        if not result.wasSuccessful():
            print(log.getvalue())
    if results != [True, False]:
        raise SystemExit("Unexpected demonstration result")
    print("Опыт подтверждён: слабый тест пропустил дефект, точный обнаружил.")
