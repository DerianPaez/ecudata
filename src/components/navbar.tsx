import { Link } from '@nextui-org/link';
import {
  NavbarBrand,
  NavbarContent,
  Navbar as NextUINavbar
} from '@nextui-org/navbar';

import Logo from '@/app/logo.svg';
import { Github } from '@geist-ui/icons';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  return (
    <NextUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand className='gap-3 max-w-fit'>
          <Link
            className='flex justify-start items-center gap-1'
            color='foreground'
            href='/'
          >
            <p className='text-2xl font-bold text-inherit flex items-center gap-2'>
              Ecudata
              <Image src={Logo} alt='Logo Ecudata' />
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='basis-1 pl-4' justify='end'>
        <Link isExternal href={'https://github.com/DerianPaez/ecudata'}>
          <Github color='white' />
        </Link>
      </NavbarContent>
    </NextUINavbar>
  );
};
