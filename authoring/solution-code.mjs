export const solutionCode={
 's05-01-unit-tests-s007':`import unittest

def fee(n):
    return 100 if n <= 5 else 60

class FeeTests(unittest.TestCase):
    def test_six_uses_lower_fee(self):
        n = 6
        actual = fee(n)
        self.assertEqual(actual, 60)`,
 's05-01-unit-tests-s013':`import unittest
from delivery import delivery_fee

class NegativeTests(unittest.TestCase):
    def test_negative_is_rejected(self):
        with self.assertRaises(ValueError):
            delivery_fee(-1)`,
 's05-01-unit-tests-s019':`import unittest
from inventory import Cart

class RejectionTests(unittest.TestCase):
    def test_zero_keeps_stock(self):
        cart = Cart(stock=7)
        with self.assertRaises(ValueError):
            cart.reserve(0)
        self.assertEqual(cart.stock, 7)`,
 's05-02-dependencies-s007':`from datetime import date
import unittest

def is_expired(now, expires):
    return now > expires

class ExpiryTests(unittest.TestCase):
    def test_equal_dates_are_not_expired(self):
        day = date(2027, 2, 3)
        self.assertIs(is_expired(day, day), False)`,
 's05-02-dependencies-s013':`import unittest

def shipping_total(weight, price_source):
    return weight * price_source("kg")

def price_source(unit):
    if unit != "kg":
        raise ValueError("unsupported unit")
    return 40

class ShippingTests(unittest.TestCase):
    def test_three_kg(self):
        actual = shipping_total(3, price_source)
        self.assertEqual(actual, 120)`,
 's05-02-dependencies-s019':`import unittest

def route_total(distance, rate_source):
    return distance * rate_source("km")

class RouteTests(unittest.TestCase):
    def test_source_request(self):
        calls = []
        def source(unit):
            calls.append(unit)
            if unit != "km":
                raise ValueError("unsupported unit")
            return 20
        self.assertEqual(route_total(12, source), 240)
        self.assertEqual(calls, ["km"])`,
 's05-03-suite-quality-s019':`import unittest

def multiply(a, b):
    return a * b

class MultiplyTests(unittest.TestCase):
    def test_distinguishes_addition(self):
        self.assertEqual(multiply(4, 6), 24)`
}
