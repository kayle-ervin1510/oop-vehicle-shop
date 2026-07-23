
def recursive(int):
    if int < 0:
        return
    print(int)
    recursive(int - 1)
recursive(3)


def refine(int):
    if int != 0:
        refine(int-1)
    print(int)
refine(3)