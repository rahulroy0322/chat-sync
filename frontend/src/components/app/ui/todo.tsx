import type { FC } from 'react';

type TodoPropsType = {
  title: string;
};

const Todo: FC<TodoPropsType> = ({ title }) => (
  <div>
    <h2 className='text-2xl uppercase font-bold text-center'>TODO!</h2>
    <h3 className='text-xl capitalize font-semibold font-mono text-center'>
      {title}
    </h3>
  </div>
);

export default Todo;
