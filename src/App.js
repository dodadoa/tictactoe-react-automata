import React, { Component } from 'react'
import { Action, withStatechart } from 'react-automata'
import styled from 'styled-components'

const statechart = {
  initial: 'new_game',
  states: {
    new_game: {
      on: {
        START: 'put_o',
      },
      onEntry: 'newGame',
    },
    put_o: {
      on: {
        IS_WIN: 'win',
        PLAY_NEXT: 'put_x',
        IS_DRAW: 'end_game',
      },
      onEntry: 'oTurn',
    },
    put_x: {
      on: {
        IS_WIN: 'win',
        PLAY_NEXT: 'put_o',
        IS_DRAW: 'end_game',
      },
      onEntry: 'xTurn',
    },
    end_game: {
      on: {
        NEW: 'new_game'
      },
      onEntry: 'endGame',
    },
    win: {
      on: {
        NEW: 'new_game'
      },
      onEntry: 'winGame',
    }
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
      prevPutPosition: {
        row: null,
        cell:  null,
      }
    }
  }

  handleSquareBoxClick = (rowIndex, cellIndex) => {
    if(this.state.prevPutPosition.row === rowIndex
      && this.state.prevPutPosition.cell === cellIndex) return
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
          ? this.props.machineState.value === 'put_x'
            ? 'o'
            : 'x'
          : cell
      })
    })
    this.checkIfOneWin(nextState)
      ? this.props.transition('IS_WIN', {
        rowIndex,
        cellIndex,
        winner: this.props.machineState.value === 'put_x'
          ? 'o'
          : 'x'
      })
      : this.props.transition('PLAY_NEXT', {
        rowIndex,
        cellIndex
      })
  }

  winGame(){
    this.setState((prevState, props) => ({
      gameState: prevState.gameState.map((row, ri) => {
        return row.map((cell, ci) => {
          return props.rowIndex === ri && props.cellIndex === ci ? props.winner : cell
        })
      }),
      prevPutPosition: {
        row: props.rowIndex,
        cell: props.cellIndex,
      }
    }))
  }

  xTurn(){
    this.setState((prevState, props) => ({
      gameState: prevState.gameState.map((row, ri) => {
        return row.map((cell, ci) => {
          return props.rowIndex === ri && props.cellIndex === ci ? 'x' : cell
        })
      }),
      prevPutPosition: {
        row: props.rowIndex,
        cell: props.cellIndex,
      }
    }))
  }

  oTurn(){
    this.setState((prevState, props) => ({
      gameState: prevState.gameState.map((row, ri) => {
        return row.map((cell, ci) => {
          return props.rowIndex === ri && props.cellIndex === ci ? 'o' : cell
        })
      }),
      prevPutPosition: {
        row: props.rowIndex,
        cell: props.cellIndex,
      }
    }))
  }

  componentDidTransition(ps, e){
    console.log(ps, e)
  }

  checkIfOneWin = (gameState) => {
    const isWinHorizontal = gameState
      .map(row => {
        return row.every(cell => cell === 'x' || cell === 'o')
      })
      .some(row => {
        return row
      })
    return isWinHorizontal
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
        <p> { this.props.winner ? this.props.winner + " win!" : "" } </p>
      </App>
    )
  }
}

App.defaultProps = {
  rowIndex: null,
  cellIndex: null,
  winner: '',
}

export default withStatechart(statechart, {
  devTools: true
})(App)
