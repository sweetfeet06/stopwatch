import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Stopwatch from './Stopwatch';
import * as serviceWorker from './serviceWorker';

//user of model view intent architecture
let view = (model) => {
    let minutes = Math.floor(model.time / 60);
    let seconds = model.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0': ''}${seconds}`;
    let handler = (event) => {
        container.dispatch( model.running ? 'STOP' : 'START');
    }
    return <div>
        <div>{minutes}:{secondsFormatted}</div>
        <button onClick={handler} >{model.running ? 'Stop' : 'Start'}</button>
    </div>;
}

let intents = {
    TICK: 'TICK',
    START: 'START',
    STOP: 'STOP',
    RESET: 'RESET'
};

const update = (model = {running: false, time:0}, intent) => {
    const updates = {
        'TICK': (model) => Object.assign(model, {time: model.time + (model.running ? 1 : 0)}),
        'STOP': (model) => Object.assign(model, {running: false}),
        'START': (model) => Object.assign(model, {running: true}),
        'RESET': (model) => Object.assign(model, {time: 0})
    };
    return (updates[intent] || (() => model))(model);
};

const createStore = (reducer) => {
    let internalState;
    let handlers = [];
    return {
        dispatch: (intent) => {
            internalState = reducer(internalState, intent);
            handlers.forEach(handler => {handler()})
        },
        subscribe: (handler) => {
            handlers.push(handler);
        },
        getState: () => internalState
    }
}


let container = createStore(update);

const render = () => {
    ReactDOM.render(view(container.getState()), document.getElementById('root'));
};
container.subscribe(render);

setInterval(() => {
        container.dispatch('TICK');
    }, 1000);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
