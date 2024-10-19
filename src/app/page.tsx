'use client';

import { subtitle, title } from '@/components/primitives';
import { SearchButton } from '@/components/search-button';
import { Input, Tooltip } from '@nextui-org/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { searchAction } from './actions/search-action';

const Home: React.FC = () => {
  const [fullName, setFullName] = useState('');

  const handleSearch = async (formData: FormData): Promise<void> => {
    try {
      const identification = formData.get('identification');
      if (!identification || typeof identification !== 'string') return;
      const data = await searchAction(identification);
      setFullName(data.fullName);
    } catch {
      toast.error(
        `Número de cedula incorrecto o error al buscar la información`
      );
    }
  };

  return (
    <section className='flex flex-col items-center justify-center gap-12 py-8 md:py-10 p-4'>
      <div className='flex flex-col max-w-lg text-center justify-center gap-1'>
        <h1 className={title()}>
          Busca información por
          <br />
          <span className={title({ color: 'yellow' })}>Número de Cédula</span>
        </h1>

        <div className={subtitle()}>
          Prximamente información de vehiculos, facturas, etc
        </div>
      </div>

      <form action={handleSearch} className='flex gap-4 max-w-screen-sm w-full'>
        <Input
          size='lg'
          type='search'
          aria-label='Search'
          placeholder='Número de cédula'
          name='identification'
        />

        <Tooltip content='Buscar'>
          <SearchButton />
        </Tooltip>
      </form>

      <div>
        <p>{fullName}</p>
      </div>
    </section>
  );
};

export default Home;
