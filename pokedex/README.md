# API

## Third Party APIs

Create a Supabase Edge Function called `hello-world`.

The function should return a JSON response: { "message": "Hello, World!" }

Include proper CORS headers so the function can be called from a browser.

After creating the function, deploy it using the Supabase CLI and show me the 
curl command to test it, using my project's deployed function URL.

--

Create a Supabase Edge Function called `add-numbers`.

The function should read two query parameters, `a` and `b`, add them together 
as numbers, and return a JSON response in the shape: { "result": <sum> }

Requirements:
- Include CORS headers
- Handle the case where `a` or `b` are missing or not valid numbers — return a 
  400 status with a JSON error message explaining what went wrong
- Deploy the function when complete and give me curl commands that test both the 
  happy path and each error case

  --

  Create a Supabse Edge Function called 'multi-numbers'.

  The function should read two query parameters, 'a' and 'b', 
  multiply them together as numbers and return a JSON response 
  in the shape {"result": <product>}

  Requirements:
  - Include CORS headers
  - Handle the case where 'a' or 'b' are missing or not valid numbers - return a
    400 status with a JSON error message explaining what went wrong
  - Deploy the function when comlete and give me curl commands 
    that test both the happy path and each error case. 

  Do you have any questions for me before we begin?

  --

  
I would like you to generate a new supabase edge function named `pokemon-team` that receives one parameter through url queires known as `type`, that will leverage the pokeAPI to generate the following:


```
{
	[
		{pikachu:front_default_sprite_for pikachu},
		{charizard:front_default_sprite_for squirtle},
		{raichu:front_default_sprite_for raichu},
		{mew:front_default_sprite_for mew}
	]
}
```

- Include CORS header
- send a request to the api endpoint: https://pokeapi.co/api/v2/type/{parameter}/ this request will return an object where they key of 'pokemon' is an array of objects where each object holds the values of name and url. Utilize the @./type_response_ex.json to analyze the response from this endpoint.

- select 6 pokemon objects at random to build my team from.

- Once we have 6 pokemon objects we will utilize the url provided to send a request. From this response we will grab the sprites front_default necessary for this response.
- From this response we will grab the sprites front_default necessary for edge function response.

Do you have any questions?

