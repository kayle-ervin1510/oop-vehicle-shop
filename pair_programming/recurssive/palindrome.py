def equal(word, left, right):
    if left >= right:
        return True
    if word[left] != word[right]:
        return False
    return equal(word, left + 1, right - 1)

def isEqual(word):
    return equal(word, 0, len(word) - 1)

if __name__ == "__main__":
    word = "abba"

