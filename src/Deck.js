import React, { useEffect, useState } from "react";
import Card from "./Card"
import axios from "axios"
import "./Deck.css"

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);


    // The useEffect hook is used to perform side effects in functional components.
    // Here, it's used to fetch data from the API and update the component's state.
    // The function loadDeckFromAPI will be executed when the component mounts (empty dependency array).
    useEffect(function loadDeckFromAPI() {
        // The fetchData function is an asynchronous function that fetches data from the API
        async function fetchData() {
            // Send a GET request to the API to create and shuffle a new deck of cards
            const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);

            // Set the component's state with the data received from the API
            setDeck(d.data);
        }

        // Call the fetchData function when the component mounts
        fetchData();

        // [] means -> The effect should only be executed once, specifically when the component mounts.
        // It means that the effect has no dependencies, and therefore, 
        // it does not depend on any state or prop changes to be triggered again. Consequently,
        // the effect will run only on the initial render of the component.
    }, []);


    /** Draw card: change the state & effect will kick in. */
    async function draw() {
        try {
            // Send a GET request to the API to draw a card from the deck   
            const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);
            // If the deck is empty (no cards remaining), throw an error
            if (drawRes.data.remaining === 0) throw new Error("Deck empty!");
            // Get the first card from the response data
            const card = drawRes.data.cards[0];
            // Update the state by adding the drawn card's information to the existing 'drawn' array
            setDrawn(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,  
                },
            ]);
        } catch (e) {
            alert (e)
        }
    }

    /** Shuffle: change the state & effect will kick in. */
    async function startShuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        } catch (e) {
            alert(e);
        } finally {
            setIsShuffling(false)
        }
    }

    /** Return draw button (disabled if shuffling) */
    function renderDrawBtnIfOk() {
        if(!deck) return null;

        return (
            <button
                className="Deck-gimme"
                onClick={draw}
                disabled={isShuffling}>
                DRAW    
            </button>
        )
    }

    /** Return shuffle button (disabled if already is) */
    function renderShuffleBtnIfOk() {
        if (!deck) return null;

        return (
            <button
                className="Deck-gimme"
                onClick={startShuffling}
                disabled={isShuffling}>
                SHUFFLE DECK    
            </button>
        )
    }

    return (
        <main className="Deck">

            {renderDrawBtnIfOk()}
            {renderShuffleBtnIfOk()} 

            <div className="Deck-cardarea">{
                drawn.map(c => (
                    <Card key={c.id} name={c.name} image={c.image} />
                ))}
            </div>

        </main>
    );

}


export default Deck;