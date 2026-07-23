def binary_search(arr, target):
    left, right = 0, len(arr) -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return True
        elif target < arr[mid]:
            right = mid - 1
        else:
            left = mid + 1
    return False
my_list = [1, 3, 5, 12, 44, 56, 78, 85]
print(binary_search(my_list, 85))
print(binary_search(my_list, 22))

def binary_search2(arr, target, left, right):
    if left > right:
        return False
    mid = (left + right) // 2

    if arr[mid] == target:
        return True
    elif target < arr[mid]:
        return binary_search2(arr, target, left, mid -1)
    else:
        return binary_search2(arr, target, mid + 1, right)


print(binary_search2(my_list, 85, 0, len(my_list)-1))
print(binary_search2(my_list, 22, 0, len(my_list)-1))

    