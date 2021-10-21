import React from 'react';
import logo from './logo.svg';
import './styles/index.scss';

const App = () => {
  return (
    <div className='App bg-black'>
      <header className='App-header'>
        <p>Testing</p>
        <img src={logo} className='App-logo w-20' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
