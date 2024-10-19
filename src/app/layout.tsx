import { Navbar } from '@/components/navbar';
import { NextUIProvider } from '@nextui-org/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Consulta nombre completo por cédula',
  description:
    'Ingresa la cédula de una persona y obtén su nombre completo al instante.',
  keywords:
    'cedula, nombre, identificador, consulta, cedula de identidad, cedula de ciudadania, cedula de extranjeria, cedula de residencia, cedula de identidad y extranjeria, cedula de identidad y residencia, cedula de ciudadania y extranjeria, cedula de ciudadania y residencia, cedula de extranjeria y residencia, cedula de identidad y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y ciudadania, cedula de identidad y ciudadania y extranjeria, cedula de identidad y ciudadania y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria y residencia, cedula de identidad y extranjeria y residencia, cedula de identidad y ciudadania y extranjeria y residencia, cedula de ciudadania y extranjeria'
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang='es'>
      <head>
        <link rel='canonical' href='https://ecuadordata.com/' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen dark`}
      >
        <NextUIProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </NextUIProvider>
      </body>
    </html>
  );
};

export default RootLayout;
