import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
      
        <div className="hefty">
          <h1 id="subtle">To Do List</h1>
          <p className="subtitle-1">
            Converting the HTML from yesterday's assignment to jsx today.
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Click to Count: {count}
        </button>
      </section>
      <section>
        <div>          
          <h2>Below is your list</h2>
          <p className="explain">You can mark items complete by clicking a checkmark.</p>
          <ul>
            <li className="bp-1">
              
              <p className="Item-1">Make Brownies</p>
            </li>
            <li className="bp-2">
              <p></p>
              <p className="Item-2">Collect Eggs</p>
            </li>
            <li className="bp-3">
              <p className="Item-3">Swap Laundry</p>
            </li>
          </ul>
        </div>
        <div id="social">          
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
