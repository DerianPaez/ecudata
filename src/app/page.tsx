'use client';

import { ComplaintBox } from '@/components/complaint-box/complaint-box';
import { subtitle, title } from '@/components/primitives';
import { SearchButton } from '@/components/search-button';
import { Complaint } from '@/types/complaint';
import { Input, Tooltip } from '@nextui-org/react';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { searchAction } from './actions/search-action';

const Home: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [complaintList, setComplaintList] = useState<Complaint[]>([]);
  const [identification, setIdentification] = useState('');

  const handleSearch = async (formData: FormData): Promise<void> => {
    try {
      const identification = formData.get('identification');
      setIdentification(identification as string);
      if (!identification || typeof identification !== 'string') return;
      const data = await searchAction(identification);
      if (!data) return;
      setFullName(data.fullName);
      setComplaintList(data.complaints);
    } catch (error) {
      console.log(error);
      toast.error(
        `Número de cedula incorrecto o error al buscar la información`
      );
    }
  };

  return (
    <Fragment>
      <section className='flex flex-col items-center justify-center gap-12 py-8 md:py-10 p-4'>
        <div className='flex flex-col max-w-lg text-center justify-center gap-1'>
          <h1 className={title()}>
            Busca información por
            <br />
            <span className={title({ color: 'yellow' })}>Número de Cédula</span>
          </h1>

          <div className={subtitle()}>
            Próximamente información de vehiculos, facturas, etc
          </div>
        </div>

        <form
          action={handleSearch}
          className='flex gap-4 max-w-screen-sm w-full'
        >
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

        {identification && (
          <ComplaintBox
            complaintList={complaintList}
            identification={identification}
          />
        )}
      </section>
    </Fragment>
  );
};

export default Home;
