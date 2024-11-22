export type Subject = {
  id: string;
  fullname: string;
  state: string;
};

export type ComplaintSubjectProps = {
  subjectList: Subject[];
};
