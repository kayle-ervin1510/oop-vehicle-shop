# From the book Python Crash Course, Chapter 9, exercise 1
# Make a class called resteraunt

class Resteraunt:
    def __init__(self, name, type):
        self.resteraunt_name = name
        self.cuisine_type = type
    
    def describe_resteraunt(self):
        print(f"Welcome to {self.resteraunt}, where we serve the best {self.cuisine_type} in the state!")


levy = ("Levy's Coin on the Cob", "Monetary Munchies")


