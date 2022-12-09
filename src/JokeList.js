import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css'

class JokeList extends Component {
    static defaultProps = {
        numberJokes: 10
    }
    constructor(props){
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
        };
        this.handleClick = this.handleClick.bind(this)
    }
    componentDidMount(){
        if(this.state.jokes.length === 0) this.getJokes()
    }
    async getJokes(){
        let jokes = []
        while(jokes.length <= this.props.numberJokes){
            let res = await axios.get('https://icanhazdadjoke.com/', {headers: {Accept: 'application/json'}});
            jokes.push({id: uuidv4(), text: res.data.joke, votes: 0})
        }
        this.setState(
            st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }),
            () =>
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }
    handleVote(id, delta){
        this.setState(
            st => ({
                jokes: st.jokes.map(j => 
                    j.id === id ? {...j, votes: j.votes + delta} : j)
            }), 
            () => 
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }
    handleClick(){
        this.setState({loading: true}, this.getJokes)
    }
    render() {
        const jokes = this.state.jokes.map(j => (
        <Joke key={j.id} text={j.text} votes={j.votes} upVote={() =>this.handleVote(j.id, 1)} downVote={() =>this.handleVote(j.id, -1)}/>
        ));
        if(this.state.loading){
            return(
            <div className='JokeList-spinner'>
                <i className='far fa-8x fa-laugh fa-spin'/>
                <h1 className='JokeList-title'>Loading...</h1>
            </div>
            )
        }
        return (
        <div className='JokeList'>
            <div className='JokeList-sidebar'>
            <h1 className='JokeList-title'><span>Dad</span> Jokes</h1>
            <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt='smiley'/>
            <button className='JokeList-btn' onClick={this.handleClick}>Get more jokes!</button>
            </div>
            <div className='JokeList-jokes'>
                {jokes}
            </div>
        </div>
        )
    }
}
export default JokeList; 