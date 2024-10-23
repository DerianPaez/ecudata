export type Complaint = ComplaintDetail & {
  id: string;
  city: string;
  infraction: string;
  subjects: Subject[];
  vehicles?: Vehicle[];
};

export type ComplaintDetail = {
  date: string;
  time: string;
  state: string;
  digitizer: string;
  idOffice: string;
  unit: string;
  prosecution: string;
};

export type Subject = {
  id: string;
  fullname: string;
  state: SubjectState;
};

export type Vehicle = {
  brand: string;
  model: string;
  plate: string;
};

export type SubjectState =
  | 'COMPLAINANT'
  | 'UNRECOGNIZED_SUSPECT'
  | 'SUSPECT'
  | 'VICTIM';
