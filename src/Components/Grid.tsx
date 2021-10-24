import React from 'react';

const Grid = (): JSX.Element => {
	return (
		<>
			<h1 className='text-center m-4'>Grid system using Tailwind</h1>
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
			<div className='flex mb-4'>
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

			{/*Flex Grid with breakpoints */}
			<h2 className='text-center mb-4'>Flexbox Grid</h2>
			<div className='flex flex-wrap mb-4'>
				<div className='w-full md:w-1/2 lg:w-1/3 bg-red-500 h-12'></div>
				<div className='w-full md:w-1/2 lg:w-1/3 bg-yellow-300 h-12'></div>
				<div className='w-full md:w-1/2 lg:w-1/3 bg-green-300 h-12'></div>
			</div>

			{/* Grid */}
			<h2 className='text-center mb-4'>CSS Grid</h2>
			<div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					1
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					2
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					3
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					4
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					5
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					6
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					7
				</div>
				<div className='bg-black h-12 rounded-md flex items-center justify-center text-white'>
					8
				</div>
				<div className='bg-fuchsia-500 h-12 rounded-md flex items-center justify-center text-white'>
					9
				</div>
			</div>
		</>
	);
};

export default Grid;
