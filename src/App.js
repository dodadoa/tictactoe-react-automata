import React, { Component } from 'react'
import { Action, withStatechart } from 'react-automata'
import styled from 'styled-components'

const statechart = {
  initial: 'new_game',
  states: {
    new_game: {
      on: {
        START: 'put_mark',
      },
      onEntry: 'newGame',
    },
    put_mark: {
      on: {
        IS_WIN: 'end_game',
        PLAY_NEXT: 'put_mark',
        IS_DRAW: 'end_game',
      },
      onEntry: 'putMark',
    },
    end_game: {
      on: {
        NEW: 'new_game'
      },
      onEntry: 'endGame',
    },
  }
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameState: [
        ['', '' ,''],
        ['', '', ''],
        ['' ,'' ,'']
      ],
      gameMessage: '',
    }
  }

  handleSquareBoxClick = (rowIndex, cellIndex) => {
    if(this.props.rowIndex === rowIndex && this.props.cellIndex === cellIndex) return
    if(this.props.machineState.value === 'win') return
    if(this.props.machineState.value === 'new_game') {
      return this.props.transition('START', {
        rowIndex,
        cellIndex,
      })
    }
    const nextState = this.state.gameState.map((row, ri) => {
      return row.map((cell, ci) => {
        return rowIndex === ri && cellIndex === ci
          ? this.props.whoturn
          : cell
      })
    })

    if(this.checkIfOneWin(nextState)){
      return this.props.transition('IS_WIN', {
        rowIndex,
        cellIndex,
        whoturn: this.props.whoturn === 'x' ? 'o' : 'x',
        gameMessage: this.props.whoturn === 'x' ? 'x win!' : 'o win!',
      })
    }

    if (this.checkIfGameEnd(nextState)) {
      return this.props.transition('IS_DRAW', {
        rowIndex,
        cellIndex,
        whoturn: this.props.whoturn === 'x' ? 'o' : 'x',
        gameMessage: 'game draw!',
      })
    }

    this.props.transition('PLAY_NEXT', {
      rowIndex,
      cellIndex,
      whoturn: this.props.whoturn === 'x' ? 'o' : 'x',
    })
  }

  endGame() {
    this.setState((prevState, props) => ({
      gameState: prevState.gameState.map((row, ri) => {
        return row.map((cell, ci) => {
          return props.rowIndex === ri && props.cellIndex === ci
            ? props.whoturn === 'x'
              ? 'o'
              : 'x'
            : cell
        })
      }),
      gameMessage: props.gameMessage,
    }))
  }

  putMark(){
    this.setState((prevState, props) => ({
      gameState: prevState.gameState.map((row, ri) => {
        return row.map((cell, ci) => {
          return props.rowIndex === ri && props.cellIndex === ci
            ? props.whoturn === 'x'
              ? 'o'
              : 'x'
            : cell
        })
      }),
    }))
  }

  checkIfGameEnd = (gameState) => {
    const flattenGameState = [
      ...gameState[0],
      ...gameState[1],
      ...gameState[2]
    ]
    return flattenGameState.every((state) => state !== '')
  }

  checkIfOneWin = (gameState) => {
    const isWinSituation = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    const flattenGameState = [
      ...gameState[0],
      ...gameState[1],
      ...gameState[2],
    ]

    return isWinSituation.some((winSituation) => {
      return winSituation.every((condition) => flattenGameState[condition] === 'o')
        || winSituation.every((condition) => flattenGameState[condition] === 'x')
    })
  }

  renderSquareBox = (rowIndex) => {
    const SquareBox = styled.div`
      width: 30px;
      height: 30px;
      margin: 10px;
      background-color: rgb(240, 238, 199);
      display: flex;
      flex-direction: row;
      justify-content: center;

      :hover {
        background-color: rgb(187, 170, 198);
        cursor: pointer;
      }
    `
    return (
      this.state.gameState[rowIndex].map((cell, cellIndex) => (
        <SquareBox onClick={() => this.handleSquareBoxClick(rowIndex, cellIndex)}>
          { cell }
        </SquareBox>
      ))
    )
  }

  renderRow = () => {
    const Row = styled.div`
      display: flex;
      flex-direction: row;
    `
    return (
      this.state.gameState.map((row, rowIndex) => (
        <Row> { this.renderSquareBox(rowIndex) } </Row>
      ))
    )
  }

  render() {
    const App = styled.div`
      padding: 100px;
    `;

    return (
      <App>
        {this.renderRow()}
        <p> { this.state.gameMessage ? this.state.gameMessage : "" } </p>
      </App>
    )
  }
}

App.defaultProps = {
  rowIndex: null,
  cellIndex: null,
  whoturn: 'o',
  gameMessage: '',
}

export default withStatechart(statechart, {
  devTools: true
})(App)
