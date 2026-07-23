import PokeCard from "./PokeCard"

export default function PokeContainer({pokemonList, rmData}) {

    return (
        <div 
        className="flex flex-wrap items-stretch gap-5">
            {
                pokemonList.map(
                    (pokemon)=>(
                        <PokeCard
                            pokemon={pokemon}
                            rmData={rmData}
                            key={pokemon.id}
                            />
                    )
                )
            }
        </div>
    )
}