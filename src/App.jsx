import React from 'react'
import './App.css'
import { MemoryGame } from './MemoryGame'

function App() {
  return (
    <>
    <h1 className='header'>Gotta Catch (remember) 'Em All</h1>
    <p className='rules'>Catch Pokémon by clicking their card but don't catch the same one twice!</p>
    <MemoryGame/>
    </>
  )
}

export default App
