import React, { Component } from 'react'
import web3 from './web3'

import './App.css'
import lottery from './lottery'

class App extends Component {
  state = { 
    manager: '',
    players: [],
    balance: '',
    value: '' 
  }

  async componentDidMount () {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({ manager, players, balance })
  }

  onSubmit = async event => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()
    this.setState({ message: 'Waiting on transaction success...'})
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })
    this.setState({ message: 'You have been successfully entered.' })
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts()
    this.setState({ message: 'Waiting on transaction success...'})
    const tx = await lottery.methods.pickWinner().send({
      from: accounts[0],
    })
    const winner = tx.events.winner.returnValues[0]
    this.setState({ message: `${winner} won the lottery!` })
  }

  render () {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>Players entered: {this.state.players.length}</p>
        <p>Pool: {web3.utils.fromWei(this.state.balance, 'ether')} ETH</p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label htmlFor=''>Amount of ether to enter:</label>
            <input
              type='text'
              value={this.state.value} // controlled input
              onChange={event => this.setState({value: event.target.value})}
              />
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Pick a winner</h4>
        <button onClick={this.onClick}>Pick</button>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    )
  }
}

export default App
