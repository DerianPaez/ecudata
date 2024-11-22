import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';
import { ComplaintSubjectProps } from './types';

export const ComplaintSubject: React.FC<ComplaintSubjectProps> = ({
  subjectList
}) => {
  return (
    <div className='grid gap-1 overflow-y-hidden'>
      <h3 className='md:text-center text-lg uppercase'>Sujetos</h3>
      <Table removeWrapper aria-label='Example static collection table'>
        <TableHeader>
          <TableColumn>Cédula</TableColumn>
          <TableColumn>Nombres Completos</TableColumn>
          <TableColumn>Estado</TableColumn>
        </TableHeader>
        <TableBody>
          {subjectList.map(({ id, fullname, state }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{fullname}</TableCell>
              <TableCell>{state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
