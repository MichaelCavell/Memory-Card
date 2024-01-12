import React, { useState, useEffect } from 'react';

export function Card() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/bulbasaur/');
        const data = await response.json();
        // Assuming the official artwork URL is in the sprites.front_default property
        const officialArtworkUrl = data.sprites?.front_default;
        
        if (officialArtworkUrl) {
          setImageUrl(officialArtworkUrl);
        } else {
          console.error('Official artwork URL not found in the response.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="card">
      <img src={imageUrl} alt="Bulbasaur" />
    </div>
  );
}
