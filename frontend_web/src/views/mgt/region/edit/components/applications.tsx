import { inject, observer } from 'mobx-react';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { WMSI18N } from '../../../../../commons/i18';
import { CustomComponentA, TargetForm, WMSPagePlugin } from '../../../../../commons/plugin.component';
import { RegionEditStore } from '../ctrl';

@WMSPagePlugin({
  name: 'region_applications',
  sidebarTitle: 'Applications',
  target: TargetForm.region_edit,
  order: 0,
  displayInModal: true,
})
@WMSI18N()
@inject('ctrl')
@observer
export default class AuthorizationComp extends CustomComponentA<{}, RegionEditStore> {
  render() {
    const { __, ctrl } = this.props;
    const { applications } = ctrl;
    return (
      <>
        <h2 id="region_applications">{__!('region.edit.applications.title')}:</h2>
        <p>{__!('region.edit.applications.description')}</p>
        <Form>
          <Row>
            <Col>
              <ListTable applications={applications} />
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}

const ListTable: React.FC<{ applications: any[] }> = ({ applications }) => {
  return (
    <Table responsive striped size="sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Descriptions</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((on) => (
          <tr key={on.id}>
            <td>{on.name}</td>
            <td>{on.description}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
