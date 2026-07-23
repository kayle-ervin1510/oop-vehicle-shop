import { useState } from 'react'
import PowerOn from './assets/PowerOn.png'

import './App.css'

function App() {
  const [turnedUp, setCount] = useState("off")
  const [turnedDown, setClass] = useState("on")
  

  return (
    <>
      <section className="overlay">
        <div>

        </div>
        <section className="top">
        <div>
          <h1 className="words">Welcome to Mute Me!</h1>
          <p className="intro">
            To get started, click the Power Button
          </p>
        </div>
        </section>
        <button
          type="button"
          className="power"
          onClick={() => setCount((turnedUp) => "on")}
          
        >
          <img src={PowerOn} className="On" width="170" height="170"/>
          
        </button>
        <p className="text">Sound is {turnedUp}</p>
        
      

        <div >
          <button
          type = "button"
          className="mute"
          onClick={()=>setClass((turnedDown)=>"off")}>
            <img src={PowerOn} className="Off" width="170" height="170"/>
            
          </button>
          <p className="text2">Sound is {turnedDown}</p>
        </div>

      

        <div></div>
        <section></section>
      </section>
      <footer className="copyRight">&copy;2026</footer>
    </>
  )
}

export default App
