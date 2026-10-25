"""Цена в рублях по явно переданному источнику курса."""


def order_total(euros, rate_source):
    if type(euros) is not int:
        raise TypeError("euros must be int")
    if euros < 0:
        raise ValueError("euros must be nonnegative")
    rate = rate_source("EUR")
    if type(rate) is not int:
        raise TypeError("rate must be int")
    if rate <= 0:
        raise ValueError("rate must be positive")
    return euros * rate
