import { Link } from '@nextui-org/link';
import {
  NavbarBrand,
  NavbarContent,
  Navbar as NextUINavbar
} from '@nextui-org/navbar';

import { Github, Home } from '@geist-ui/icons';

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
            <Home />
            <p className='font-bold text-inherit'>Logo</p>
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
