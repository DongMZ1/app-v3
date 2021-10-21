import React from 'react';
import logo from './logo.svg';
import './styles/index.scss';

const App = () => {
  return (
    <>
      <h1 className='text-center m-5'>Grid system using Tailwind</h1>
      <div className='flex mb-4'>
        <div className='w-full bg-gray-300 h-12'></div>
      </div>

      <div className='flex mb-4'>
        <div className='w-1/2 bg-gray-500 h-12'></div>
        <div className='w-1/2 bg-gray-300 h-12'></div>
      </div>

      <div className='flex mb-4'>
        <div className='w-1/3 bg-gray-500 h-12'></div>
        <div className='w-1/3 bg-gray-300 h-12'></div>
        <div className='w-1/3 bg-gray-500 h-12'></div>
      </div>

      <div className='flex mb-4'>
        <div className='w-1/4 bg-gray-300 h-12'></div>
        <div className='w-1/4 bg-gray-500 h-12'></div>
        <div className='w-1/4 bg-gray-300 h-12'></div>
        <div className='w-1/4 bg-gray-500 h-12'></div>
      </div>

      <div className='flex mb-4'>
        <div className='w-1/5 bg-gray-300 h-12'></div>
        <div className='w-1/5 bg-gray-500 h-12'></div>
        <div className='w-1/5 bg-gray-300 h-12'></div>
        <div className='w-1/5 bg-gray-500 h-12'></div>
        <div className='w-1/5 bg-gray-300 h-12'></div>
      </div>

      <div className='flex mb-4'>
        <div className='w-1/6 bg-gray-500 h-12'></div>
        <div className='w-1/6 bg-gray-300 h-12'></div>
        <div className='w-1/6 bg-gray-500 h-12'></div>
        <div className='w-1/6 bg-gray-300 h-12'></div>
        <div className='w-1/6 bg-gray-500 h-12'></div>
        <div className='w-1/6 bg-gray-300 h-12'></div>
      </div>
      <div className='flex'>
        <div className='w-1/12 bg-gray-500 h-12'></div>
        <div className='w-1/12 bg-gray-300 h-12'></div>
        <div className='w-1/12 bg-gray-500 h-12'></div>
        <div className='w-1/12 bg-gray-300 h-12'></div>
        <div className='w-1/12 bg-gray-500 h-12'></div>
        <div className='w-1/12 bg-gray-300 h-12'></div>
        <div className='w-1/12 bg-gray-500 h-12'></div>
        <div className='w-1/12 bg-gray-300 h-12'></div>
        <div className='w-1/12 bg-gray-500 h-12'></div>
        <div className='w-1/12 bg-gray-300 h-12'></div>
        <div className='w-1/12 bg-gray-500 h-12'></div>
        <div className='w-1/12 bg-gray-300 h-12'></div>
      </div>

      <h2>Card</h2>
    </>
  );
};

export default App;
