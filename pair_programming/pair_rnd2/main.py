# Construct a student registry, with the class called Student
# Utilize the following:
# - class attributes
# - class methods
# - implimenting getters
# - implementing setters
# - and intilize class instances
# The below code was written by Josh Gabe, during a pair programming project on 7/7/2026
class Student:
    def __init__(self, name: str, age: int = 13, grade: str = "12th"):
        self.name = name
        self.age = age
        self.grade = grade

    @property
    def get_name(self) -> str:
        return self._name

    @get_name.setter
    def name(self, name_val) -> str:
        if not (isinstance(name_val, str)):
            return "Invalid input type"
        elif not len(name_val) >= 3:
            return "Invalid input length, name must be 3 characters or longer"
        self._name = name_val.strip().title()
        # return f"Congratulations {self._name}, you are registered for class!"

    @property
    def get_age(self) -> int:
        return self._age

    @get_age.setter
    def age(self, age_int) -> int:
        if not (isinstance(age_int, int)):
            return "Age must be a number"
        elif not (11 < age_int < 18):
            return "Too cool for school?"
        self._age = age_int

    @property
    def get_grade(self) -> str:
        return self._grade

    @get_grade.setter
    def grade(self, grade_class) -> str:
        if not (isinstance(grade_class, str)):
            return "Grade must be a string with 'th' after it"
        elif  not (9 <= int(grade_class[:-2]) <= 12):
            return "Not in the right school"
        self._grade = grade_class


#    def __str__(self):
#        return f"{self._name} is a {self._age} year old student in {self._grade} grade at Far Far Away High School."
'''
Shrek = Student(name = '   Shrek    ', age = 12, grade = '12th')

Fiona = Student("Fiona", 17, "12th")

Donkey = Student("Donkey", 15, "11th")
'''