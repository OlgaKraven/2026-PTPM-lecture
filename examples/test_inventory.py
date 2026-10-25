import unittest
from inventory import Cart


class CartTests(unittest.TestCase):
    def test_reserve_changes_stock(self):
        cart = Cart(stock=6)
        accepted = cart.reserve(2)
        self.assertTrue(accepted)
        self.assertEqual(cart.stock, 4)

    def test_insufficient_stock_is_unchanged(self):
        cart = Cart(stock=4)
        accepted = cart.reserve(5)
        self.assertFalse(accepted)
        self.assertEqual(cart.stock, 4)

    def test_zero_is_rejected_without_changes(self):
        cart = Cart(stock=7)
        with self.assertRaises(ValueError):
            cart.reserve(0)
        self.assertEqual(cart.stock, 7)

    def test_string_is_rejected_without_changes(self):
        cart = Cart(stock=4)
        with self.assertRaises(TypeError):
            cart.reserve("2")
        self.assertEqual(cart.stock, 4)

    def test_exact_stock_is_allowed(self):
        cart = Cart(stock=4)
        self.assertTrue(cart.reserve(4))
        self.assertEqual(cart.stock, 0)

    def test_instances_are_independent(self):
        first = Cart(stock=6)
        second = Cart(stock=6)
        first.reserve(2)
        self.assertEqual(second.stock, 6)
