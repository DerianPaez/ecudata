'use server';

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
  console.log(identification);
  const response = await fetch(
    `https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion/${identification}`
  );

  const data: SearchActionResponse = await response.json();

  return {
    fullName: data.contribuyente.nombreComercial
  };
};
