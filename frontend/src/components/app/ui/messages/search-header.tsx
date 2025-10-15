import { Search } from 'lucide-react';
import type { ComponentProps, FC } from 'react';
import HeaderUI from '../header';

type SearchHeaderUIPropsType = ComponentProps<'input'>;

const SearchHeaderUI: FC<SearchHeaderUIPropsType> = (props) => (
  <HeaderUI>
    <div
      className='w-2/3 text-ring placeholder:text-muted-foreground rounded-md focus-within:border-ring flex gap-2 px-3 py-1 border-2 border-input'
      role='presentation'
    >
      <Search />
      <input
        className='outline-none w-full'
        placeholder='Search Chat...'
        type='text'
        {...props}
      />
    </div>
  </HeaderUI>
);

export default SearchHeaderUI;
