//import Button from "../Button"

export default function PokeForm({handleSubmit, setPokemonName, pokemonName}) {
    return (
        <form 
        onSubmit={(event)=>handleSubmit(event)}
        className="mb-6 p-6 ounded-xl bg-white shadow-sm">
            <label 
            htmlFor="pokemon-name"
            className="mb-2 block font-semibold text-slate-700">
                Pokemon Name
            </label>
            <div className="flex gap-3">
            <input
                type="text"
                name="name"
                placeholder="koffing"
                value={pokemonName}
                onChange={(e)=>{setPokemonName(e.target.value)}}
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
                <button
                type="submit"
                className="shrink-0 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                >Catch 'em all!</button>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Try searching for koffing, meowth, or mewtwo!
                </p>
        </form>
    )
}