# Create an application where users can sign up with name, email address, etc.
class User:
    def __init__(user, name, email_address, driver_license):
        user.name = name
        user.email_address = email_address
        user.driver_license = driver_license
    

        
    
    def DUI(user):
        user.is_drunk = True
        return f"{user.name} do you want a DUI? I'll send you driver's license to the cops."
    
    def not_drunk(user):
        user.not_drunk = False
        return f"{user.name} you are good to drive. Here are your keys."

Leona = User(name="Leona", driver_license="254lk63", email_address="L@callme@gmail.com")
print(Leona)
print(Leona.DUI())

Kaylee = User(name="Kaylee", driver_license="h20formepls", email_address="kaylee@gmail.com")
print(Kaylee)
print(Kaylee.DUI())

Ronnie = User(name="Ronnie", driver_license="brbimdrivin", email_address="ronnie@gmail.com")
print(Ronnie)
print(Ronnie.not_drunk())
