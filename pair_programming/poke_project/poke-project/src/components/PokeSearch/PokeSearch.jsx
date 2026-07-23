import axios from 'axios'
import PokeContainer from "./PokeContainer"
import PokeForm from "./PokeForm"
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function PokeSearch() {
    const [pokemonName, setPokemonName] = useState("")
    const [pokemonList, setPokemonList] = useState([])

    useEffect(
        ()=> {
            const getStartingPokemon = async ()=> {
                const response = await axios.get("https://pokeapi.co/api/v2/pokemon/koffing")
                setPokemonList([response.data])
            }
            getStartingPokemon()
        },[]
    )

    useEffect (
        ()=>{
            console.log("pokemon list has been changed (or this is the first mount)")
            console.log(pokemonList)
        },[pokemonList]
    )

    const addPokemonData=(data)=>{
        setPokemonList([...pokemonList, data])
    }

    const rmData = (id)=>{
        setPokemonList(pokemonList.filter((pokemon)=>pokemon.id!==id))
    }

    const getPokemonData = async () =>{
        const requestURL = "https://pokeapi.co/api/v2/pokemon/${pokemonName}"
        try{
            let response = await axios.get(requestURL)
            console.log(response)
            addPokemonData(response.data)
        }catch(err){
            console.log(err)
            alert("Pokemon does not exist - or you misspelled it's name!")
        }finally{
            console.log("That's all!")
        }
    }

    const handleSubmit=(event)=>{
        event.preventDefault()
        getPokemonData()
        setPokemonName("")
    }

    return (
        <>
        <PokeForm handleSubmit={handleSubmit} setPokemonName={setPokemonName} pokemonName={pokemonName}/>
        <PokeContainer
        pokemonList={pokemonList}
        rmData={rmData}
        />
        </>
    )
    
}