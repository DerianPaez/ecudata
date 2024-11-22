import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';
import { ComplaintVehicleProps } from './types';

export const ComplaintVehicle: React.FC<ComplaintVehicleProps> = ({
  vehicleList
}) => {
  return (
    <div className='grid gap-1 overflow-y-hidden'>
      <h3 className='md:text-center text-lg uppercase'>Vehículos</h3>
      <Table removeWrapper aria-label='Example static collection table'>
        <TableHeader>
          <TableColumn>Marca</TableColumn>
          <TableColumn>Modelo</TableColumn>
          <TableColumn>Placa</TableColumn>
        </TableHeader>
        <TableBody>
          {vehicleList.map(({ brand, model, plate }) => (
            <TableRow key={plate}>
              <TableCell>{brand}</TableCell>
              <TableCell>{model}</TableCell>
              <TableCell>{plate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
