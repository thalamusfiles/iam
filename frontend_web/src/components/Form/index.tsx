import React from 'react';
import { InputGroup } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { AttributeType, PickerType } from '../../commons/attribute-type';
import { findWmsFormPlugin } from '../../commons/plugin.component';
import '../../plugins';
import { WmsBooleanFormControl } from './wms-boolean-formcontrol';
import { WmsChoiceFormControl } from './wms-choice-formcontrol';
import { WmsDateFormControl } from './wms-date-formcontrol';
import { WmsDateTimeFormControl } from './wms-datetime-formcontrol';
import { WmsDecimalFormControl, WmsIntegerFormControl } from './wms-number-formcontrol';
import { WmsTextFormControl } from './wms-text-formcontrol';
import { WmsTimeFormControl } from './wms-time-formcontrol';

/**
 * Definição das opções de um campo selecionavel
 */

export type WmsOptionValue = {
  value: any;
  columns: string[];
};
export type WmsFormEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | React.SyntheticEvent<any>;
/**
 * Definição da função chamada ao alterar um formulario
 *
 */
declare type WmsFormEventHandler = (value: any | null, description: string[] | string | null, event: WmsFormEvent) => void;

/**
 * Propriedades do formulário
 */
export declare type WmsFormProps = {
  type: AttributeType | PickerType;
  name: string;
  title?: string;
  placeholder?: string;
  value?: any | [any] | null;
  description?: string;
  disabled?: boolean;
  // Informativos
  invalidFeed?: any;
  appendFeed?: string;

  filters?: any;
  //propriedade do formGroup
  groupAs?: any;
  column?: any;
  //propriedades do campo text
  multiline?: number;
  //propriedades do campo boolean
  checked?: boolean;
  //propriedades do campo selecionável
  multi?: boolean;
  header?: string[];
  options?: WmsOptionValue[];
  //control
  controlClassName?: string;

  onChange?: WmsFormEventHandler;
};

export declare type IampFormGroupProps = {
  append: any;
} & WmsFormProps;

export function WmsFormGroup(props: WmsFormProps) {
  let Control, Column;
  switch (props.type) {
    case AttributeType.Text:
      Control = WmsTextFormControl(props);
      break;
    case AttributeType.Integer:
      Control = WmsIntegerFormControl(props);
      break;
    case AttributeType.Decimal:
      Control = WmsDecimalFormControl(props);
      break;
    case AttributeType.Boolean:
      Control = WmsBooleanFormControl(props);
      break;
    case AttributeType.MultiChoice:
      props.multi = true;
      Control = WmsChoiceFormControl(props);
      break;
    case AttributeType.Choice:
      Control = WmsChoiceFormControl(props);
      break;
    case AttributeType.Time:
      Control = WmsTimeFormControl(props);
      break;
    case AttributeType.DateTime:
      Control = WmsDateTimeFormControl(props);
      break;
    case AttributeType.Date:
      Control = WmsDateFormControl(props);
      break;
    default:
      Control = findWmsFormPlugin(props.type as PickerType, props);
  }
  Column = props.column ? <Col>{Control}</Col> : Control;
  return (
    <Form.Group as={props.groupAs}>
      {props.title && (
        <Form.Label column={props.column} sm={props.column ? 2 : undefined}>
          {props.title}
        </Form.Label>
      )}
      {Column}
      <Form.Control.Feedback type="invalid">{props.invalidFeed}</Form.Control.Feedback>
      {props.appendFeed && <Form.Text muted>{props.appendFeed}</Form.Text>}
    </Form.Group>
  );
}

export function IamInputGroup(props: IampFormGroupProps) {
  let Control, Column;
  switch (props.type) {
    case AttributeType.Text:
      Control = WmsTextFormControl(props);
      break;
    case AttributeType.Integer:
      Control = WmsIntegerFormControl(props);
      break;
    case AttributeType.Decimal:
      Control = WmsDecimalFormControl(props);
      break;
    case AttributeType.Boolean:
      Control = WmsBooleanFormControl(props);
      break;
    case AttributeType.MultiChoice:
      props.multi = true;
      Control = WmsChoiceFormControl(props);
      break;
    case AttributeType.Choice:
      Control = WmsChoiceFormControl(props);
      break;
    case AttributeType.Time:
      Control = WmsTimeFormControl(props);
      break;
    case AttributeType.DateTime:
      Control = WmsDateTimeFormControl(props);
      break;
    case AttributeType.Date:
      Control = WmsDateFormControl(props);
      break;
    default:
      Control = findWmsFormPlugin(props.type as PickerType, props);
  }
  Column = props.column ? <Col>{Control}</Col> : Control;
  return (
    <InputGroup as={props.groupAs}>
      {props.title && (
        <Form.Label column={props.column} sm={props.column ? 2 : undefined}>
          {props.title}
        </Form.Label>
      )}
      {Column}
      <Form.Control.Feedback type="invalid">{props.invalidFeed}</Form.Control.Feedback>
      {props.appendFeed && <Form.Text muted>{props.appendFeed}</Form.Text>}
      {props.append}
    </InputGroup>
  );
}
