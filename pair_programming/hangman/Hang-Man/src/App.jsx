import { useEffect, useState } from 'react'
//import { PuzzleWord } from './components/PuzzleWord'
//import { HangingMan } from './components/HangingMan'
//import { Keyboard } from './components/Keyboard'
import axios from 'axios'
//import words from './PuzzleWord.json'
import './App.css'

//function getGuess() {
//  return words[Math.floor(Math.random() * words.length)];
//}

function App () {

//  const [GuessWord, setGuess] = useState(getWord)
//  const [GuessedGuess, setGuessedGuess] = useState([

//  ])

//  const incorrectGuess = GuessedGuess.filter(guess => !GuessWord.includes(guess))

//  const lose = incorrectGuess.length >= 6
//  const win = GuessWord.split("").every(guess =>GuessedGuess.inlcues(guess))

//  const addGuessedGuess = useCallback((guess)=> {
    if(GuessedGuess.includes(guess) || win || lose) return

    setGuessedGuess(currentGuesses => [...currentGuesses, guess])
//  }, [GuessedGuess])

//  useEffect(() => {
//    const handler = (e, KeyboardEvent) => {
//      const key = e.key

//      if (!key.match(/^[a-z]$/)) return
//      e.preventDefault();
//      addGuessedGuess(key)
//    }
//    document.addEventListener("keypress", handler)
//    return () => {
//      document.removeEventListner("keypress", handler)
//    }
//  }, [GuessedGuess])

//  useEffect(() => {
//    const handler = (e, KeyboardEvent) => {
//      const key = e.key

//      if (key !== "Enter") return
//      e.preventDefault();
//      setGuessedGuess([])
//      setGuess(getGuess())
//    }
//    document.addEventLisnter("keypress", handler)
//    return () => {
//      document.removeEventListener("keypress", handler)
//    }
//  }, [])


  return (
    <>

    <header className="title">
    Hang Man
    </header>
    <section className="intro">
    <div className="welcome">
    
    Welcome to Hang Man! 
    <li className="welcome">In this game, you try to guess one of several words. </li>
    <li className="welcome">If you get letter of the word right, your "hang man" is safe.</li>
    <li className="welcome">However, if you don't get a letter right, a man is drawn being hanged.</li>
    <li className="welcome">So, to keep your man alive and win the game, be very careful what letters you guess.</li>
    <li className="welcome">Because no one likes to be a hanged man :( </li>
      </div>
    </section>
    <section className="begin">
      <p>To begin, please type a letter in the search engine.</p>
      <form className="find" onSubmit={(event)=>handleSubmit(event)}>
        <input type="text" name="name" placeholder="a"/>
        <input type="submit" value="Search"/>
      </form>
    </section>
    <footer className="copyright">
      &copy; 2026
    </footer>
      
    </>
  
  )
}

export default App
