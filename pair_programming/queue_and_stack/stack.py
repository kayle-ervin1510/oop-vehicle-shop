####API####
# push - add item to top
# pop - remove and return item from top
# peek - return top item
# size - return number of items
# is_empty - True if no items, False otherwise

class Stack:
    def __init__(self):
        self._books = []
    
    def addBook(self, book):
        self._books.append(book)

    def removeBook(self):
        if not self._books:
            raise Exception("Your book stack is empty.")
        return self._books.pop()
    
    def peek(self):
        if not self._books:
            raise Exception("Your book stack is empty")
        return self._books[-1]
    
    def isEmpty(self):
        if self._books == []:
            return True
        return False
    
#    def totalBooks(self, name):
#        if self._books != []:
#            return self._books.count(name)
    
my_stack = Stack()
my_stack.addBook("Icons") #1st - bottom stack
my_stack.addBook("Hobbit") #2nd
my_stack.addBook("Twilight") #3rd
my_stack.addBook("Wolves") #4th - top stack
print(my_stack.peek())

wolves = my_stack.removeBook()
print(wolves)

print(my_stack.peek())