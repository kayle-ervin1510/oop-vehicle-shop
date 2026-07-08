class Car:

    total_cars = 0
    all_cars = []
    

    def __init__(self, id: int, make: str, model: str, year: int, mileage: int, services: str):
        self.id = id
        self.make = make
        self.model = model
        self.year = year
        self.mileage = mileage
        self.services = services
        self.curr_cars = Car.total_cars

    def generate_cars():
        curr_cars = Car.total_cars
        Car.total_cars += 1
        return curr_cars
    
    @property
    def get_id(self):
        return self.get_id
    
    @get_id.setter
    def id(self, car_id):
        if not (isinstance(car_id, int)):
            return f"I'm sorry, that is an invalid vehicle id number."
        self._id = car_id

    @property
    def update_mileage(self):
        return self.update_mileage

    @update_mileage.setter
    def update(self, mileage_is):
        if not (isinstance(mileage_is, int)):
            return f"Mileage input must be in numerical format, not string"
        elif 3000 < mileage_is < 5000:
            return f"Your car's overdue for a check-up! Schedule now, before any damage occurs."
        elif 0 < mileage_is < 1500:
            return f"Looking good right now."
        elif 1500 < mileage_is < 3000:
            return f"Looks like you're due for a check-up! Please schedule within the next few days."
        self._mileage = mileage_is

    def car_deets(self):
        return f"{self.id}, {self.make}, {self.model}, {self.year}, {self.mileage}"

    def __str__(self):
        return f"{self.id}, {self.make}, {self.model}, {self.year}, {self.mileage}, {self.services}"

def car_management():
    user_input = input("Welcome to Car Manager! Here are your menu options: 1. Add a car, 2. View all cars, 3. View total number of cars, 4. See a car's details, 5. Service a car, 6. Update Mileage, 7. Quit. Please enter the number of your selection to get started.")
    
    #if user_input == "1":

    #elif user_input == "2":

    #elif user_input == "3":
    
    #elif user_input == "4":

    #elif user_input == "5":

    #elif user_input == "6":

    #elif user_input == "7":