import { useEffect, useState } from 'react'
//import Button from "../Button"

export default function Counter() {
    const [count, setCount] = useState(0)

    useEffect(
  ()=>{
    console.log("count changed")
    const colors = ["lavenderblush", "goldenrod", "beige", "seagreen"]
    const randomIndex = Math.floor(Math.random()*colors.length)
    document.body.style.backgroundColor = colors[randomIndex]
  },
  [count]
)

    const addToCount=()=>{
        setCount(count + 1)
    }
    
return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2x1 font-bold text-slate-800">Counter</h2>
    <p calssName="my-4 text-lg"> Total Clicks: <span className="font-bold text-sky-700">{count}</span></p>
  <button
    className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald700 active:scale-95" 
    onClick={ addToCount }>Select Me!</button>
    </section>
)

}