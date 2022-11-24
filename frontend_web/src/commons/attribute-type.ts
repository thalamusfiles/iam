export enum AttributeType {
  Text,
  Integer,
  Decimal,
  Boolean,
  Choice,
  MultiChoice,
  Date,
  DateTime,
  Time,
  Json,
}

export const PickersNames = {
  person: 'person_picker',
};

export type PickerType = 'person_picker' | string;
