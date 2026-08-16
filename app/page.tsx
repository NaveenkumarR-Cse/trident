'use client'

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

type Mark = 'X' | 'O'
type Cell = Mark | null

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function getWinner(board: Cell[]) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line: [a, b, c] }
    }
  }
  return null
}

export default function Page() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<Mark>('X')
  const [scores, setScores] = useState({ X: 0, O: 0 })

  const winner = useMemo(() => getWinner(board), [board])
  const draw = !winner && board.every(Boolean)
  const gameOver = Boolean(winner || draw)

  function play(index: number) {
    if (board[index] || gameOver) return
    const next = [...board]
    next[index] = turn
    const result = getWinner(next)
    setBoard(next)
    if (result) setScores((current) => ({ ...current, [result.mark]: current[result.mark] + 1 }))
    else if (!next.every(Boolean)) setTurn(turn === 'X' ? 'O' : 'X')
  }

  function resetRound() {
    setBoard(Array(9).fill(null))
    setTurn('X')
  }

  function resetGame() {
    resetRound()
    setScores({ X: 0, O: 0 })
  }

  return (
    <main className="game-shell">
      <div className="game-card">
        <header className="game-header">
          <div>
            <p className="eyebrow">TWO PLAYER CLASSIC</p>
            <h1>XOX<span>.</span></h1>
          </div>
          <button className="reset-icon" onClick={resetGame} aria-label="Reset game" title="Reset game">
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
        </header>

        <section className="scoreboard" aria-label="Scoreboard">
          <div className={`score ${turn === 'X' && !gameOver ? 'active' : ''}`}>
            <span className="score-mark x-mark">X</span>
            <span className="score-name">PLAYER X</span>
            <strong>{scores.X}</strong>
          </div>
          <div className="versus">VS</div>
          <div className={`score ${turn === 'O' && !gameOver ? 'active' : ''}`}>
            <span className="score-mark o-mark">O</span>
            <span className="score-name">PLAYER O</span>
            <strong>{scores.O}</strong>
          </div>
        </section>

        <div className="status" role="status" aria-live="polite">
          {winner ? <><span className={winner.mark === 'X' ? 'x-mark' : 'o-mark'}>{winner.mark}</span> takes the round!</> : draw ? 'A perfect stalemate.' : <><span className={turn === 'X' ? 'x-mark' : 'o-mark'}>{turn}</span>&apos;s turn</>}
        </div>

        <section className="board" aria-label="Tic-tac-toe board">
          {board.map((cell, index) => {
            const isWinning = winner?.line.includes(index)
            return (
              <button
                key={index}
                className={`cell ${cell ? (cell === 'X' ? 'cell-x' : 'cell-o') : ''} ${isWinning ? 'winning' : ''}`}
                onClick={() => play(index)}
                aria-label={cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}, empty`}
              >
                {cell}
              </button>
            )
          })}
        </section>

        <div className="actions">
          <button className="new-round" onClick={resetRound}>{gameOver ? 'PLAY AGAIN' : 'NEW ROUND'}</button>
          <button className="reset-text" onClick={resetGame}>Reset score</button>
        </div>
        <p className="hint">First to three in a row wins the round.</p>
      </div>
    </main>
  )
}
