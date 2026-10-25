"""Учебный контракт доставки: целые рубли, порог включён."""


def delivery_fee(amount):
    if type(amount) is not int:
        raise TypeError("amount must be int")
    if amount < 0:
        raise ValueError("amount must be nonnegative")
    return 0 if amount >= 3000 else 300
