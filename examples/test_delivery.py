import unittest
from delivery import delivery_fee


class DeliveryTests(unittest.TestCase):
    def test_threshold_is_free(self):
        amount = 3000
        actual = delivery_fee(amount)
        self.assertEqual(actual, 0)

    def test_threshold_neighbours(self):
        for amount, expected in [(2999, 300), (3000, 0), (3001, 0)]:
            with self.subTest(amount=amount):
                self.assertEqual(delivery_fee(amount), expected)

    def test_zero_is_paid(self):
        self.assertEqual(delivery_fee(0), 300)

    def test_negative_is_rejected(self):
        with self.assertRaises(ValueError):
            delivery_fee(-1)

    def test_string_is_rejected(self):
        with self.assertRaises(TypeError):
            delivery_fee("3000")

    def test_other_types_are_rejected(self):
        for amount in [None, True, 3000.0, ""]:
            with self.subTest(amount=amount):
                with self.assertRaises(TypeError):
                    delivery_fee(amount)
