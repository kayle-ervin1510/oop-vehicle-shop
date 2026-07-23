GOAL: Integrate Stripe into my application for people to conduct a 1-off transaction

STEPS: 



SUPABASE(SERVER): 

- edge functions
    - validate our request
    - supabase communicates with stripe and awaits the client_secret
    - Stripe UI receives the client_secret
    - webhook listening for the state of the transaction
    - DB
     - (TRANSACTION M-0 U) DB

REACT(UI):
- component that will allow users to click on and start the donation process
- Stripe UI will populate a form for payment
- upon clicking pay (the initialization of the transaction happens)
