import unittest
from order import order_total


class OrderTests(unittest.TestCase):
    def test_order_total_uses_rate(self):
        calls = []

        def source(currency):
            calls.append(currency)
            return 100

        self.assertEqual(order_total(20, source), 2000)
        self.assertEqual(calls, ["EUR"])

    def test_different_amount_and_rate(self):
        self.assertEqual(order_total(3, lambda currency: 90), 270)

    def test_source_failure_is_propagated(self):
        def unavailable(currency):
            raise ConnectionError("offline")

        with self.assertRaises(ConnectionError):
            order_total(20, unavailable)

    def test_invalid_rate_is_rejected(self):
        for rate in [0, -1]:
            with self.subTest(rate=rate):
                with self.assertRaises(ValueError):
                    order_total(20, lambda currency: rate)

    def test_wrong_rate_type_is_rejected(self):
        with self.assertRaises(TypeError):
            order_total(20, lambda currency: "100")
