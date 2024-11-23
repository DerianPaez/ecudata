'use server';

import { Complaint, Subject, SubjectState, Vehicle } from '@/types/complaint';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { revalidatePath } from 'next/cache';
import puppeteer from 'puppeteer';

export type SearchActionResponse = {
  contribuyente: {
    nombreComercial: string;
  };
};

export type SearchActionResponseAdapted = {
  fullName: string;
  complaints: Complaint[];
};

export const searchAction = async (
  identification: string
): Promise<SearchActionResponseAdapted> => {
  const fullName = await getFullName(identification);
  const complaints = await getComplaintsById(identification);

  return {
    fullName,
    complaints
  };
};

const getFullName = async (identification: string): Promise<string> => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('name', identification);
  encodedParams.set('tipo', 'I');

  const options = {
    method: 'POST',
    url: 'https://www.ecuadorlegalonline.com/modulo/consultar-cedula.php',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: encodedParams
  };

  const { data } = await axios.request(options);
  const $ = cheerio.load(data);

  const fullName = $('#name0 a strong').text();
  return fullName;
};

const getComplaintsById = async (
  identification: string
): Promise<Complaint[]> => {
  const browser = await puppeteer.launch({
    headless: 'shell'
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );
  await page.goto(
    'https://www.gestiondefiscalias.gob.ec/siaf/informacion/web/noticiasdelito/index.php'
  );

  await page.waitForSelector('#pwd');

  await page.type('#pwd', identification);

  await page.click('#btn_buscar_denuncia');

  await page.waitForSelector('#resultados', { visible: true });

  const data = await page.evaluate(() => {
    const complaints: Complaint[] = [];
    const crimesElements: Element[] = [];
    const results = document.querySelector('#resultados');

    if (results) {
      const generals = results.querySelectorAll('.general');

      generals.forEach((el) => {
        const subGeneral = el.querySelector('.general');

        if (subGeneral) {
          el.removeChild(subGeneral);
        }

        crimesElements.push(el);
      });
    }

    crimesElements.forEach((c) => {
      const tables = c.querySelectorAll('table');
      const detailsHead = tables[0].querySelector('thead');
      const detailsBody = tables[0].querySelector('tbody');
      const subjectsBody = tables[1].querySelector('tbody');
      const vehiclesBody = tables[2]?.querySelector('tbody');
      const subjects: Subject[] = [];
      const vehicles: Vehicle[] = [];

      subjectsBody?.querySelectorAll('tr')?.forEach((s) => {
        const state = s.querySelectorAll('td')[2].textContent?.trim();
        const stateMap: Record<string, SubjectState> = {
          DENUNCIANTE: 'COMPLAINANT',
          'SOSPECHOSO NO RECONOCIDO': 'UNRECOGNIZED_SUSPECT',
          SOSPECHOSO: 'SUSPECT',
          VICTIMA: 'VICTIM'
        };

        const subject: Subject = {
          id: s.querySelectorAll('td')[0].textContent?.trim() || '',
          fullname: s.querySelectorAll('td')[1].textContent?.trim() || '',
          state: stateMap[state || '']
        };

        subjects.push(subject);
      });

      vehiclesBody?.querySelectorAll('tr')?.forEach((v) => {
        const vehicle: Vehicle = {
          brand: v.querySelectorAll('td')[0].textContent?.trim() || '',
          model: v.querySelectorAll('td')[1].textContent?.trim() || '',
          plate: v.querySelectorAll('td')[2].textContent?.trim() || ''
        };

        vehicles.push(vehicle);
      });

      const complaint: Complaint = {
        id:
          detailsHead
            ?.querySelector('tr')
            ?.querySelector('th')
            ?.textContent?.trim()
            ?.replace('NOTICIA DEL DELITO Nro. ', '') || '',
        city:
          detailsBody
            ?.querySelectorAll('tr')?.[0]
            ?.querySelectorAll('td')?.[2]
            ?.textContent?.trim() || '',
        date:
          detailsBody
            ?.querySelectorAll('tr')?.[0]
            ?.querySelectorAll('td')?.[4]
            ?.textContent?.trim() || '',
        time:
          detailsBody
            ?.querySelectorAll('tr')?.[1]
            ?.querySelectorAll('td')?.[1]
            ?.textContent?.trim() || '',
        digitizer:
          detailsBody
            ?.querySelectorAll('tr')?.[1]
            ?.querySelectorAll('td')?.[3]
            ?.textContent?.trim() || '',
        state:
          detailsBody
            ?.querySelectorAll('tr')?.[2]
            ?.querySelectorAll('td')?.[1]
            ?.textContent?.trim() || '',
        idOffice:
          detailsBody
            ?.querySelectorAll('tr')?.[2]
            ?.querySelectorAll('td')?.[3]
            ?.textContent?.trim() || '',
        infraction:
          detailsBody
            ?.querySelectorAll('tr')?.[3]
            ?.querySelectorAll('td')?.[1]
            ?.textContent?.trim() || '',
        unit:
          detailsBody
            ?.querySelectorAll('tr')?.[4]
            ?.querySelectorAll('td')?.[1]
            ?.textContent?.trim() || '',
        prosecution:
          detailsBody
            ?.querySelectorAll('tr')?.[4]
            ?.querySelectorAll('td')?.[2]
            ?.textContent?.trim() || '',
        subjects,
        vehicles
      };

      complaints.push(complaint);
    });

    return complaints;
  });

  await browser.close();
  revalidatePath('/');

  return data;
};
