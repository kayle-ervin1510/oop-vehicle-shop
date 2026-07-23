####API####
# enqueue - add item to beginning
# dequeue - remove and return item from end
# peek - return last item
# size - return number of items
# is_empty - True if no items, False otherwise

class Queued:
    def __init__(self):
        self._names = []

    def addName(self, name):
        self._names.append(name)
        
    
    def isEmpty(self):
        if self._names == []:
            return True
        return False
    

    def removeName(self):
        if not self._names:
            raise Exception("Queue is currently empty")
        return self._names.pop(0)
    
    def peek(self):
        if not self._names:
            raise Exception("Queue is currently empty")
        return self._names[0]
    
#    def count(self, names):
#        if not self._names:
#            return Exception("Queue is currently empty")
#        self.names = names
#        for name in names:
#            if name
#        return self._names.count(names)
        
    
    
my_queue = Queued()
my_queue.addName("John")
my_queue.addName("Jacob")
my_queue.addName("Jingle-Heimer")
my_queue.addName("Smith")
print(my_queue.peek())
john = my_queue.removeName()
print(john)
print(my_queue.peek())
#print(my_queue.isEmpty())
#print(my_queue.count())