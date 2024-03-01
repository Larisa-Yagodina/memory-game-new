import React, {useEffect, useState} from "react";
import "./App.css";
import Board from './Board'

const emoji = ['🐬', '🐍', '🏄', '⛵️', '🌺', '🌴',];

export default function App() {

    // массив, который наполним эмоджи
    const [cards, setCards] = useState(new Array(12).fill({}).map(el => ({id: Math.random(), emoji: '', open: false})))
    // счетчик ходов (чтобы запускать проверку каждый 2-ой ход)
    const [count, setCount] = useState(0);
    // сохраняем эмоджи в историю, чтобы проверять совпадения
    const [history, setHistory] = useState([]);
    // сохраняем id в историю, чтобы знать, какие карточки скрывать
    const [historyId, setHistoryId] = useState([]);
    // результат конкретной игры
    const [result, setResult] = useState(0);
    const [resultsAccumulator, setResultsAccumulator] = useState([])
    const [isBlock, setIsBlock] = useState(false)

    const createCards = () => {
        const newCards = cards.map(el => ({...el, emoji: '', open: false,}));
        for (let i = 0; i < emoji.length; i++) {
            for (let tm = 1; tm <= 2; tm++) {
                let j;
                do {
                    j = Math.floor(Math.random() * 12);
                } while (newCards[j].emoji !== '')
                newCards[j].emoji = emoji[i]
            }
        }
        setCards(newCards);
    }


    // открываем карточки
    const openCard = (cardId) => {
        let intoHistory;
        let intoHistoryId;
        const newCards = cards.map(el => {
            if (el.id === cardId) {
                intoHistory = el.emoji;
                intoHistoryId = el.id;
                return {...el, open: true}
            }
            ;
            return el;
        })
        setCards(newCards)
        setCount(count + 1);
        setHistory([...history, intoHistory])
        setHistoryId([...historyId, intoHistoryId])
        setIsBlock(true)
    }

    // проверяем, одинаковы ли открытые последние 2 карточки
    const handleMoveResult = () => {
        if (count % 2 === 0 && history[history.length - 1] !== history[history.length - 2]) {
            setTimeout(() => {
                let newCards = cards.map(el => {
                    if (el.id === historyId[historyId.length - 1] || el.id === historyId[historyId.length - 2])
                        return {...el, open: false};
                    return el;
                })
                setCards(newCards)
                setIsBlock(false)
            }, 1200);
        } else {
            setIsBlock(false)
        }
    }

    console.log(isBlock)

    // чтобы показать результат, подсчитываем кол-во ходов (2 карточки - 1 ход)
    const howManyMoves = () => {
        let allMoves = 0
        if (!(cards.map(el => el.open).includes(false))) {
            allMoves = count / 2;
        }
        setResult(allMoves)
    }

    // сохраняем результат игры (к-во ходов)
    const saveResult = () => {
        const newAccumulator = [...resultsAccumulator, result];
        setResultsAccumulator(newAccumulator)
    }

    // запускаем игру заново, задаем снова начальные значения
    const startAgain = () => {
        const newCards = [...cards];
        for (let i = 0; i < newCards.length; i++) {
            newCards[i].open = false;
            newCards[i].emoji = '';
        }
        setCards(newCards);
        setCount(0)
        setHistory([]);
        setHistoryId([]);
        setResult(0)
        saveResult()
    }

    // когда сохранен результат игры, карточки наполняются снова, чтобы начать
    useEffect(() => {
        createCards();
    }, [resultsAccumulator])

    // через 0,7 секунд после каждого хода
    // запускаеся проверка, совпали ли карточки
    useEffect(() => {
        handleMoveResult()
    }, [count])

    // через 12 ходов начинаем проверять результаты
    // если все карточки открыты, считаем кол-во ходов.
    useEffect(() => {
        if (count > 12) {
            setTimeout(() => {
                howManyMoves();
            }, 600);
        }
    }, [count])

    return (
        <div className="App">
            <h1>Memory Game</h1>
            <Board
                isBlock={isBlock}
                cards={cards}
                openCard={openCard}
            />
            {resultsAccumulator[0] &&
                <div>
                    Your results: {resultsAccumulator.join(', ')}
                </div>
            }
            {result ? <div>
                <h2>{`You win in ${result} moves!`}</h2>
                <button onClick={startAgain} className='button'> Start again</button>
            </div> : null}
        </div>
    );
}