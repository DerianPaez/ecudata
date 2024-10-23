'use server';

import axios from 'axios';
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

type Complaint = {
  id: string; // Número de delito
  city: string; // LUGAR
  date: string; // FECHA
  time: string; // HORA
  state: string; // ESTADO
  digitizer: string; // DIGITADOR
  idOffice: string; // Nro. OFICIO
  infraction: string; // DELITO
  unit: string; // UNIDAD
  prosecution: string; // FISCALIA
  subjects: Subject[];
};

type Subject = {
  id: string; // Cédula
  fullname: string; // NOMBRES COMPLETOS
  state: SubjectState; // ESTADO
};

enum SubjectState {
  COMPLAINANT = 'COMPLAINANT',
  UNRECOGNIZED_SUSPECT = 'UNRECOGNIZED_SUSPECT',
  SUSPECT = 'SUSPECT',
  VICTIM = 'VICTIM'
}

export const searchAction = async (
  identification: string
): Promise<SearchActionResponseAdapted> => {
  const response = await axios.get<SearchActionResponse>(
    `https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion/${identification}`
  );

  const complaints = await getComplaintsById(identification);

  const data = response.data;

  return {
    fullName: data.contribuyente.nombreComercial,
    complaints
  };
};

const getComplaintsById = async (
  identification: string
): Promise<Complaint[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 50
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
      const subjects: Subject[] = [];

      subjectsBody?.querySelectorAll('tr')?.forEach((s) => {
        const state = s.querySelectorAll('td')[2].textContent?.trim();
        const stateMap: Record<string, SubjectState> = {
          DENUNCIANTE: SubjectState.COMPLAINANT,
          'SOSPECHOSO NO RECONOCIDO': SubjectState.UNRECOGNIZED_SUSPECT,
          SOSPECHOSO: SubjectState.SUSPECT,
          VICTIMA: SubjectState.VICTIM
        };

        const subject: Subject = {
          id: s.querySelectorAll('td')[0].textContent?.trim() || '',
          fullname: s.querySelectorAll('td')[1].textContent?.trim() || '',
          state: stateMap[state || '']
        };

        subjects.push(subject);
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
        subjects
      };

      complaints.push(complaint);
    });

    return complaints;
  });

  await browser.close();

  return data;
};
