import { useEffect, useState } from "react"
//import styles from './heading.module.css'
//import Button from "../Button"

export default function Heading() {

  const [heading, setHeading] = useState("Poke Ball!")

    useEffect(
    ()=>{
    console.log("heading changed")
    console.log(heading)
  },[heading]
  )

return (
    <header className="round-xl bg-slate-900 p-6 text-white shadow-lg tracking-widest">
      <p className="mb-2 text-sm font-semibold text-sky-300 uppercase">Tailwind CSS</p>
     <h1 className="text-4x1 font-bold">{heading}</h1>
  <button onClick={ ()=>{setHeading("Open Poke Ball!")} }>Change Title</button>
    </header>
  )
}