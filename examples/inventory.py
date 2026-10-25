"""Изолированный учебный объект резервирования."""


class Cart:
    def __init__(self, stock):
        if type(stock) is not int:
            raise TypeError("stock must be int")
        if stock < 0:
            raise ValueError("stock must be nonnegative")
        self.stock = stock

    def reserve(self, qty):
        if type(qty) is not int:
            raise TypeError("qty must be int")
        if qty <= 0:
            raise ValueError("qty must be positive")
        if qty > self.stock:
            return False
        self.stock -= qty
        return True
