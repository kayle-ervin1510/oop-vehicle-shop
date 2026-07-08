class Car:

    number_cars = 0
    all_cars = []
    

    def __init__(self, id: int, make: str, model: str, year: int, mileage: int, services: str):
        self.id = id
        self.make = make
        self.model = model
        self.year = year
        self.mileage = mileage
        self.services = services
        """
        self.total_cars = Car.number_Cars
        """

    def add_cars():
        total_cars = Car.number_cars
        Car.number_cars += 1
        return total_cars
    
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

    @property
    def get_year(self):
        return self.get_year
    
    @get_year.setter
    def year(self, year_is):
        if not (3 < year_is < 5):
            return f"I'm sorry, that year is not in our database. A year must be four characters long."
        elif not (isinstance(year_is, int)):
            return f"I'm sorry, the year of your vehicle cannot be a string. It must be of numerical value."
        self._year = year_is

    @property
    def check_make(self):
        return self.check_make
    
    @check_make.setter
    def make(self, make_is):
        if not (isinstance(make_is, str)):
            return f"I'm sorry, that make is invalid. The make of your vehicle must be a string."
        self._make = make_is
    
    @property
    def check_model(self):
        return self.check_model
    
    @check_model.setter
    def model(self, model_is):
        if not (isinstance(model_is, str)):
            return f"I'm sorry, that model is invalid. The model of your vehicle must be a string."
        elif (len(model_is) < 2):
            return f"I'm sorry, we do not recognize that car model. The model's we know of contain at least 3 characters."
        self._model = model_is


    #def car_deets(self):
    #    return f"{self.id}, {self.make}, {self.model}, {self.year}, {self.mileage}"

    def __str__(self):
        return f"{self.id}, {self.make}, {self.model}, {self.year}, {self.mileage}, {self.services}"

#def car_management():
#    user_input = input("Welcome to Car Manager! Here are your menu options: 1. Add a car, 2. View all cars, 3. View total number of cars, 4. See a car's details, 5. Service a car, 6. Update Mileage, 7. Quit. Please enter the number of your selection to get started.")
    
    #if user_input == "1":

    #elif user_input == "2":

    #elif user_input == "3":
    
    #elif user_input == "4":

    #elif user_input == "5":

    #elif user_input == "6":

    #elif user_input == "7":