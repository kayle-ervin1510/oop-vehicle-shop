import './Poke.css'
import { useEffect } from 'react'
import Heading from "./components/Heading/Heading"
import PokeSearch from "./components/PokeSearch/PokeSearch"
import Counter from "./components/Counter/Counter"
//import axios from 'axios'
//import PokeBall from './assets/poke-ball.png'




function Poke() {
  

  useEffect (
    ()=>{
      console.log("page mounted")
      return ()=>{console.log("page unmounted")}
    }, []
  )

  

return (
  <main className="min-h-screen bg-slate-100 p-8">
    <div className="mx-auto max-w-5xl space-y-8">
    
      <Heading/>
      <Counter/>
      <PokeSearch/>
    </div>
  </main>
)
}
export default Poke
