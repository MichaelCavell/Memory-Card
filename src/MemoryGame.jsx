import React, { useState, useEffect } from 'react';

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function MemoryGame() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(
    () => JSON.parse(localStorage.getItem('highestScore')) || 0);


  console.log(pokemonList)

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        const shuffledPokemon = shuffleArray(data.results.map(pokemon => ({ ...pokemon, isClicked: false })));
        setPokemonList(shuffledPokemon);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  const handleCardClick = (name) => {
    const pokemon = pokemonList.find(p => p.name === name);

    if (pokemon.isClicked) {
      setIsRunning(false);
      gameOver(false); // false indicates loss
    } else {
      setScore(score + 1); // Increment score for a successful click

      const updatedPokemonList = pokemonList.map(p =>
        p.name === name ? { ...p, isClicked: true } : p
      );
      setPokemonList(shuffleArray(updatedPokemonList));

      if (updatedPokemonList.every(p => p.isClicked)) {
        setIsRunning(false);
        gameOver(true); // true indicates win
      }
    }
  };

  const gameOver = (hasWon) => {
    if (score > highestScore) {
      setHighestScore(score);
      localStorage.setItem('highestScore', JSON.stringify(score)); // Persist the score
    }

    let message = hasWon 
      ? `Congratulations! You caught all ${pokemonList.length} Pokémon!` 
      :  `Game Over! You caught ${score} Pokémon. Gotta try again to catch 'em all!`;
    alert(message);
    resetGame();
  };

  const resetGame = () => {
    const resetPokemonList = pokemonList.map(p => ({ ...p, isClicked: false }));
    setPokemonList(shuffleArray(resetPokemonList));
    setIsRunning(true);
    setScore(0);
  };

  return (
    <>
    <div className='scores'>
    <p className='score'>Current Score: {score}</p>
    <p className='score'>High Score: {highestScore}</p>
    </div>
    <div className="cards-container">
      {pokemonList.map((pokemon) => (
        <Card key={pokemon.name} name={pokemon.name} onClick={() => handleCardClick(pokemon.name)} />
      ))}
    </div>
    </>
  );
}

export function Card({ name, onClick }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        const data = await response.json();
        const officialArtworkUrl = data.sprites.front_default;

        if (officialArtworkUrl) {
          setImageUrl(officialArtworkUrl);
        } else {
          console.error('Official artwork URL not found in the response.');
        }
      } catch (error) {
        console.error(`Error fetching data for ${name}:`, error);
      }
    };

    fetchPokemonData();
  }, [name]);

  return (
    <div className="card" onClick={onClick}>
      <img src={imageUrl} alt={name} />
      <p>{capitalizeFirstLetter(name)}</p>
    </div>
  );
}
