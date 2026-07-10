class Student:
    def __init__(self, name, age=13, grade="12th"):
        self.name = name
        self.age = age
        self.grade = grade

    @property
    def get_the_name(self):
        return self.get_the_name
    
    @get_the_name.setter
    def name(self, name_is):
        if not (isinstance(name_is, str)):
            return "Invalid input type - must be a string."
        elif not len(name_is) >= 3:
            return "Error, your name must be longer than 3 characters. Sorry Eve."
        elif not name_is.isalpha():
            return "No special characters for names, and no special treatment for students."
        self._name = name_is.strip().title()

    @property
    def get_the_age(self):
        return self.get_the_age
    
    @get_the_age.setter
    def age(self, age_num):
        if not(isinstance(age_num, int)):
            return "Age is a number. It can't be anything else."
        elif not (11 < age_num < 19):
            return "Too cool for this school, dude. Gotta be between ages 11 and 18 to attend."
        self._age = age_num

    @property
    def get_that_grade(self):
        return self.get_that_grade
    
    @get_that_grade.setter
    def grade(self, grade_is):
        if not (isinstance(grade_is, str)):
            return "A grade must be a string, followed by the letters 'th'."
        elif not (9 <= int(grade_is[:-2]) <=12):
            return "That may be your grade, but this isn't your school."
        self._grade = grade_is
    
    def __str__(self):
        return f"{self._name}, age {self._age}, is a {self._grade} grade student at Crystal Cove High School."
    """
    def advance(self, years_advanced=1):
        return f"{self._name} has been advanced to {self._grade}."
    
    def study(self, study):
        self.study = study
        return f"{self._name} is studying {study}"
    """

fred = Student("Fred", 18, "11th")

daphne = Student("Daphne", 17, "12th")

velma = Student("Velma", 15, "12th")

shaggy = Student("Norville", 16, "11th")
print(
    f"""
    {fred}
    {daphne}
    {velma}
    {shaggy}
    """
)
