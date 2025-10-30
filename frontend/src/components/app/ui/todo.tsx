import type { FC } from 'react';

type TodoPropsType = {
  title: string;
};

const Todo: FC<TodoPropsType> = ({ title }) => (
  <div className='flex flex-col items-center justify-center'>
    <h2 className='text-2xl uppercase font-bold'>COMINGSOON!</h2>
    <h3 className='text-xl capitalize font-semibold font-mono'>{title}</h3>
  </div>
);

export default Todo;
