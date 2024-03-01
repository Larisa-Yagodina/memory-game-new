import React from 'react';
import Square from './Square';

const Board = ({cards, openCard, isBlock}) => (

    <div className={isBlock ? 'board block' : 'board'}>
        {cards.map((card, i) => (
            <Square
                key={i}
                card={card}
                openCard={openCard}
                isBlock={isBlock}
            />
        ))}
    </div>
)

export default Board;