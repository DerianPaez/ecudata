import { Accordion, AccordionItem, Chip, ChipProps } from '@nextui-org/react';
import { ComplaintDetail } from '../complaint-detail/complaint-detail';
import { ComplaintSubject } from '../complaint-subject/complaint-subject';
import { ComplaintVehicle } from '../complaint-vehicle/complaint-vehicle';
import { ComplaintBoxProps } from './types';

export const ComplaintBox: React.FC<ComplaintBoxProps> = ({
  complaintList,
  identification
}) => {
  return (
    <div className='bg-[#18181b] p-8 grid gap-3 rounded-lg w-full'>
      <h2 className='text-2xl font-semibold'>Denuncias</h2>
      {complaintList.length === 0 ? (
        <div className=' text-gray-400'>No hay denuncias para mostrar</div>
      ) : (
        <Accordion variant='light' className='px-0'>
          {complaintList.map(
            ({
              id,
              infraction,
              city,
              date,
              digitizer,
              idOffice,
              prosecution,
              state,
              time,
              unit,
              subjects,
              vehicles
            }) => {
              const colorsByState: {
                [key: string]: ChipProps['color'];
              } = {
                ['COMPLAINANT']: 'primary',
                ['UNRECOGNIZED_SUSPECT']: 'warning',
                ['SUSPECT']: 'danger',
                ['VICTIM']: 'secondary'
              };

              const labelByStateMap = {
                ['COMPLAINANT']: 'Denunciante',
                ['UNRECOGNIZED_SUSPECT']: 'Sospechoso no reconocido',
                ['SUSPECT']: 'Sospechoso',
                ['VICTIM']: 'Víctima'
              };

              const subjectState = subjects.find(
                (subject) => subject.id === identification
              )?.state;

              const labelByState =
                subjectState !== 'UNKNOWN' && subjectState
                  ? labelByStateMap[subjectState]
                  : '';

              return (
                <AccordionItem
                  key={id}
                  aria-label={infraction}
                  title={
                    <div className='flex flex-wrap gap-1'>
                      <span>
                        DELITO Nro. {id} - {infraction}
                      </span>
                      {subjectState && (
                        <Chip
                          color={colorsByState[subjectState]}
                          variant='flat'
                        >
                          {labelByState}
                        </Chip>
                      )}
                    </div>
                  }
                  subtitle={`${date} | ${city}`}
                >
                  <div className='grid gap-8'>
                    <ComplaintDetail
                      digitizer={digitizer}
                      idOffice={idOffice}
                      prosecution={prosecution}
                      state={state}
                      time={time}
                      unit={unit}
                    />
                    <ComplaintSubject
                      subjectList={subjects.map((s) => ({
                        id: s.id,
                        fullname: s.fullname,
                        state: labelByState
                      }))}
                    />
                    {vehicles && vehicles.length > 0 && (
                      <ComplaintVehicle vehicleList={vehicles} />
                    )}
                  </div>
                </AccordionItem>
              );
            }
          )}
        </Accordion>
      )}
    </div>
  );
};
