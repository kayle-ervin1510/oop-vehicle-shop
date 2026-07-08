from car_management import Car

car_1 = (59, "Toyota", "Camry", 1987, 200, ["Vacuuming", "Tire Pressure Check", "Quick Fix"])
car_2 = (626, 'Christler', 'Town & Country', 2008, 2800, ['Weekly Maintinence', 'Window Cleanring', 'Tire Pressure Chec'])
print(
    f"""
    {car_1}
    {car_2}
    """
)

print(Car.car_deets)

print(Car.total_cars)

print(Car.all_cars)

