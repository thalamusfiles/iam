import { mount } from 'enzyme';
import moment from 'moment';
import { AttributeType } from '../../commons/attribute-type';
import { WmsFormGroup } from './index';

describe('WmsFormGroup tests', () => {
  formControlTester({
    title: 'WmsNumberFormControl (Integer)',
    type: AttributeType.Integer,
    value: 1,
    changedValue: 2,
  });

  formControlTester({
    title: 'WmsNumberFormControl (Decimal)',
    type: AttributeType.Decimal,
    value: 1.1,
    changedValue: 2.2,
  });

  formControlTester({
    title: 'WmsBooleanFormControl',
    type: AttributeType.Boolean,
    value: true,
    changedValue: false,
  });

  formControlWithPickerTester({
    title: 'WmsChoiceFormControl',
    type: AttributeType.Choice,
    value: 'firstValue',
    changedValue: 'secondValue',
  });

  formControlTester({
    title: 'WmsTimeFormControl',
    type: AttributeType.Time,
    value: moment('2021-04-07T18:34:39Z').toDate(),
    changedValue: moment('2021-04-07T19:35:39Z').toDate(),
  });

  formControlTester({
    title: 'WmsDateTimeFormControl',
    type: AttributeType.DateTime,
    value: moment('2021-04-07T18:34:39Z').toDate(),
    changedValue: moment('2021-05-07T18:34:39.000Z').toDate(),
  });

  formControlTester({
    title: 'WmsDateFormControl',
    type: AttributeType.Date,
    value: moment('2021-04-05').toDate(),
    changedValue: moment('2021-04-06').toDate(),
  });

  formControlTester({
    title: 'WmsTextFormControl',
    type: AttributeType.Text,
    value: 'Test',
    changedValue: 'Test changed',
  });
});

type FormControlTesterParams = {
  title: string;
  type: AttributeType;
  value: any;
  changedValue: any;
};

function formControlTester(params: FormControlTesterParams) {
  it(`/ ${params.title}`, () => {
    //arrange
    let displayValue = params.value;
    let component = mount(
      <WmsFormGroup name="test" title="Test" type={params.type} value={params.value} onChange={(value) => (displayValue = value)} />,
    );

    //act
    component.find(`input[name="test"]`).simulate('change', { target: { value: params.changedValue } });

    //assert
    expect(displayValue).toStrictEqual(params.changedValue);
  });
}

function formControlWithPickerTester(params: FormControlTesterParams) {
  it(`/ ${params.title}`, () => {
    //arrange
    let displayValue = params.value;
    let component = mount(
      <WmsFormGroup
        name="test"
        title="Test"
        type={params.type}
        value={params.value}
        onChange={(value) => (displayValue = value)}
        options={[{ value: params.changedValue, columns: [params.changedValue] }]}
      />,
    );

    //act
    component.find(`select`).simulate('mouseDown');
    component.find(`td`).simulate('click');

    //assert
    expect(displayValue).toBe(params.changedValue);
  });
}
