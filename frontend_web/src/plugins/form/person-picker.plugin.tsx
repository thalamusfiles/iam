import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { PickersNames } from '../../commons/attribute-type';
import { defaultPageSize } from '../../commons/consts';
import { WmsFormComponent, WmsFormPlugin } from '../../commons/plugin.component';
import { historyPush } from '../../commons/route';
import { WmsPicker } from '../../components/Form/wms-picker';
import { PersonCRUDDatasource } from '../../datasources/apicrud';

@WmsFormPlugin({
  name: PickersNames.person,
})
export class PersonPickerPlugin extends WmsFormComponent {
  pickerRef: any = null;

  viewClick = () => {
    if (this.props.value) {
      historyPush('person_edit', { id: this.props.value.id, inModal: true });
    }
  };

  render() {
    let option = this.props.description;
    if (!option) {
      if (typeof this.props.value === 'string') option = this.props.value;
      else option = '';
    }

    return (
      <>
        <InputGroup>
          <Form.Control autoComplete="off" as="select" name={this.props.name} value={this.props.value} onMouseDown={() => this.pickerRef.show()}>
            <option>{option}</option>
          </Form.Control>
          <InputGroup.Text onClick={this.viewClick}>
            <FontAwesomeIcon color={'gray'} size="xs" icon={'eye'} />
          </InputGroup.Text>
        </InputGroup>
        <PersonPicker
          onSel={(value: any | null, row: any, event: any) => this.props.onChange && this.props.onChange(value, row, event)}
          filters={this.props.filters}
          title={this.props.title}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class PersonPicker extends WmsPicker<{ filters: any }> {
  search = (): void => {
    const filters = (this.props as any).filters || {};
    filters.name = `%${this.state.search}%`;
    filters.take = Math.floor(defaultPageSize / 2);

    new PersonCRUDDatasource().findAll(filters).then((response) => {
      const options = response.map((result) => ({
        value: result,
        columns: [result.name],
      }));

      this.setOptions(options);
    });
  };
}
