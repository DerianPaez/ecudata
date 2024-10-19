import { Search } from '@geist-ui/icons';
import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

export const SearchButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <Button size='lg' isIconOnly type='submit' isLoading={pending}>
      <Search className='text-base text-default-400 pointer-events-none ' />
    </Button>
  );
};
