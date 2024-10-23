import { Accordion, AccordionItem } from '@nextui-org/react';
import { ComplaintDetail } from '../complaint-detail/complaint-detail';
import { ComplaintSubject } from '../complaint-subject/complaint-subject';
import { ComplaintVehicle } from '../complaint-vehicle/complaint-vehicle';
import { ComplaintBoxProps } from './types';

export const ComplaintBox: React.FC<ComplaintBoxProps> = ({
  complaintList
}) => {
  return (
    <Accordion variant='splitted'>
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
          return (
            <AccordionItem
              key={id}
              aria-label={infraction}
              title={`DELITO Nro. ${id} - ${infraction}`}
              subtitle={`Ciudad: ${city}`}
            >
              <div className='grid gap-8'>
                <ComplaintDetail
                  date={date}
                  digitizer={digitizer}
                  idOffice={idOffice}
                  prosecution={prosecution}
                  state={state}
                  time={time}
                  unit={unit}
                />
                <ComplaintSubject subjectList={subjects} />
                {vehicles && <ComplaintVehicle vehicleList={vehicles} />}
              </div>
            </AccordionItem>
          );
        }
      )}
    </Accordion>
  );
};
