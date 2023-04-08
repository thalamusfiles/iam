import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApplicationCRUDDatasource } from '@thalamus/iam-consumer';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { PickersNames } from '../../commons/attribute-type';
import { defaultPageSize } from '../../commons/consts';
import { SortOrder } from '../../commons/enums/sort-order.enum';
import { WmsFormComponent, WmsFormPlugin } from '../../commons/plugin.component';
import { historyPush } from '../../commons/route';
import { WmsPicker } from '../../components/Form/wms-picker';

@WmsFormPlugin({
  name: PickersNames.application,
})
export class ApplicationPickerPlugin extends WmsFormComponent {
  pickerRef: any = null;

  viewClick = () => {
    if (this.props.value) {
      historyPush('user_edit', { id: this.props.value.id, inModal: true });
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
        <ApplicationPicker
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

export class ApplicationPicker extends WmsPicker<{ filters: any }> {
  search = (): void => {
    const where = (this.props as any).filters || {};
    where.name = `%${this.state.search}%`;
    
    const limit = Math.floor(defaultPageSize / 2);
    const order_by = [`name:${SortOrder[SortOrder.Asc]}`];

    new ApplicationCRUDDatasource().findAll({ where, order_by, limit }).then((response: any) => {
      const options = response.map((result: any) => ({
        value: result,
        columns: [result.name],
      }));

      this.setOptions(options);
    });
  };
}
