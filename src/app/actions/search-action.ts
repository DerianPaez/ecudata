'use server';

import axios from 'axios';

export type SearchActionResponse = {
  contribuyente: {
    nombreComercial: string;
  };
};

export type SearchActionResponseAdapted = {
  fullName: string;
};

export const searchAction = async (
  identification: string
): Promise<SearchActionResponseAdapted> => {
  const response = await axios.get<SearchActionResponse>(
    `https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion/${identification}`
  );

  const data = response.data;

  return {
    fullName: data.contribuyente.nombreComercial
  };
};
