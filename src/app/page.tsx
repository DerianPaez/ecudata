'use client';

import { subtitle, title } from '@/components/primitives';
import { Search } from '@geist-ui/icons';
import { Button, Input, Tooltip } from '@nextui-org/react';
import { useState } from 'react';

const Home: React.FC = () => {
  const [identification, setIdentification] = useState('');

  const handleSearch = (): void => {
    alert(`Search: ${identification}`);
  };

  return (
    <section className='flex flex-col items-center justify-center gap-12 py-8 md:py-10'>
      <div className='flex flex-col max-w-lg text-center justify-center gap-1'>
        <h1 className={title()}>
          Busca información por
          <br />
          <span className={title({ color: 'yellow' })}>Número de Cédula</span>
        </h1>

        <div className={subtitle()}>Vehiculos, Facturas, etc</div>
      </div>

      <div className='flex flex-col gap-4 max-w-screen-sm w-full sm:flex-row'>
        <Input
          size='lg'
          type='search'
          aria-label='Search'
          placeholder='Número de cédula'
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
        />

        <Tooltip content='Buscar'>
          <Button size='lg' isIconOnly onClick={handleSearch}>
            <Search className='text-base text-default-400 pointer-events-none ' />
          </Button>
        </Tooltip>
      </div>
    </section>
  );
};

export default Home;
