def fact(n):
    if n == 0:
        return 1
    last = n * fact(n - 1)
    print(last)
    return last    
fact(6)