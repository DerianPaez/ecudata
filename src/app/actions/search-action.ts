'use server';

import { Complaint, Subject, SubjectState, Vehicle } from '@/types/complaint';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

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
  return fullName.replaceAll('�', 'Ñ').toUpperCase();
};

const getComplaintsById = async (
  identification: string
): Promise<Complaint[]> => {
  const response = await axios.get(
    'https://www.gestiondefiscalias.gob.ec/siaf/comunes/noticiasdelito/info_mod.php',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      },
      params: {
        businfo: `a:1:{i:0;s:10:"${identification}";}`
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    }
  );

  const $ = cheerio.load(response.data);

  const complaints: Complaint[] = [];
  const results = $('.general');

  if (results.length) {
    const generals = $('.general');

    generals.each((_, el) => {
      const $c = $(el);
      const subGeneral = $c.find('.general');

      if (subGeneral.length) {
        subGeneral.remove();
      }

      const tables = $c.find('table');

      const detailsHead = tables.eq(0).find('thead');
      const detailsBody = tables.eq(0).find('tbody');
      const subjectsBody = tables.eq(1).find('tbody');
      const vehiclesBody = tables.eq(2)?.find('tbody');
      const subjects: Subject[] = [];
      const vehicles: Vehicle[] = [];

      subjectsBody.find('tr').each((_, s) => {
        const $s = $(s);
        const tds = $s.find('td');
        const state = tds.eq(2).text().trim();
        const stateMap: Record<string, SubjectState> = {
          DENUNCIANTE: 'COMPLAINANT',
          'SOSPECHOSO NO RECONOCIDO': 'UNRECOGNIZED_SUSPECT',
          SOSPECHOSO: 'SUSPECT',
          VICTIMA: 'VICTIM'
        };

        const subject: Subject = {
          id: tds.eq(0).text().trim() || '',
          fullname: tds.eq(1).text().trim() || '',
          state: stateMap[state || ''] || 'UNKNOWN'
        };

        subjects.push(subject);
      });

      vehiclesBody?.find('tr').each((_, v) => {
        const $v = $(v);
        const tds = $v.find('td');

        const vehicle: Vehicle = {
          brand: tds.eq(0).text().trim() || '',
          model: tds.eq(1).text().trim() || '',
          plate: tds.eq(2).text().trim() || ''
        };

        vehicles.push(vehicle);
      });

      const complaint: Complaint = {
        id:
          detailsHead
            .find('tr')
            .find('th')
            .text()
            .trim()
            .replace('NOTICIA DEL DELITO Nro. ', '') || '',
        city: detailsBody.find('tr').eq(0).find('td').eq(2).text().trim() || '',
        date: detailsBody.find('tr').eq(0).find('td').eq(4).text().trim() || '',
        time: detailsBody.find('tr').eq(1).find('td').eq(1).text().trim() || '',
        digitizer:
          detailsBody.find('tr').eq(1).find('td').eq(3).text().trim() || '',
        state:
          detailsBody.find('tr').eq(2).find('td').eq(1).text().trim() || '',
        idOffice:
          detailsBody.find('tr').eq(2).find('td').eq(3).text().trim() || '',
        infraction:
          detailsBody.find('tr').eq(3).find('td').eq(1).text().trim() || '',
        unit: detailsBody.find('tr').eq(4).find('td').eq(1).text().trim() || '',
        prosecution:
          detailsBody.find('tr').eq(4).find('td').eq(2).text().trim() || '',
        subjects,
        vehicles
      };

      complaints.push(complaint);
    });
  }
  return complaints;
};
