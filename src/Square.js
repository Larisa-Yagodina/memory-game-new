import React from 'react';

const Square = ({card, openCard}) => {

    return (
        <button
            className='square'
            onClick={() => openCard(card.id)}
        >
            {card.open ? card.emoji : null}
        </button>
    )
}
export default Square;