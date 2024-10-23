import { ComplaintDetailProps } from './types';

export const ComplaintDetail: React.FC<ComplaintDetailProps> = ({
  date,
  time,
  digitizer,
  state,
  unit,
  prosecution,
  idOffice
}) => {
  return (
    <div className='grid gap-1'>
      <p>
        <b>Fecha:</b> {date}
      </p>
      <p>
        <b>Hora:</b> {time}
      </p>
      <p>
        <b>Digitador:</b> {digitizer}
      </p>
      <p>
        <b>Estado:</b> {state}
      </p>
      <p>
        <b>Unidad:</b> {unit}
      </p>
      <p>
        <b>Fiscalia:</b> {prosecution}
      </p>
      <p>
        <b>Nro. Oficio:</b> {idOffice}
      </p>
    </div>
  );
};
