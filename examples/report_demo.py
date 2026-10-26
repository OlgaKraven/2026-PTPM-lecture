"""Учебный запуск четырёх исходов unittest; FAILED здесь преднамерен."""
import unittest


class ReportDemo(unittest.TestCase):
    def test_success(self):
        self.assertEqual(0, 0)

    def test_wrong_price(self):
        self.assertEqual(300, 0)

    def test_unexpected_error(self):
        raise TypeError("source must be callable")

    @unittest.skip("учебный пример невыполненного случая")
    def test_skipped(self):
        self.fail("этот метод не должен выполняться")


if __name__ == "__main__":
    unittest.main(verbosity=2)
