import { useState } from "react"
import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Stack from "react-bootstrap/Stack"
import { Link } from "react-router-dom"


export default function PokeCard({pokemon, rmData}) {
    const [shiny, setShiny] = useState(false)

    const imageSource = shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default
    return (
        <Card style={ {width:"18trem"} }>
            <Card.Img
                variant="top"
                src={imageSource}
                alt={pokemon.name}
                />
            <Card.Body>
           <Card.Text>
            <Badge bg="secondary"> Pokedex #{pokemon.id}</Badge>
           </Card.Text>

            <Card.Title>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Card.Title>
            <Stack direction="horizontal" gap={2}>
            <Button
            variant ="danger"
             onClick={()=>rmData(pokemon.id)}
            >
                Remove
             </Button>
            
            <Button
            variant={shiny ? "secondary" : "warning"}
            onClick={()=>setShiny(!shiny)}
            >
            {shiny?"Unmake Shiny":"Make Shiny"}
            </Button>
            <Button as={Link} to={`/pokemon/${pokemon.id}`}>Details</Button>
        </Stack>
        </Card.Body>
        </Card>
    )

}