import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useI18N } from '../../../../../commons/i18';
import { addPagePlugin, TargetForm } from '../../../../../commons/plugin.component';
import { useCommonEditStore } from '../../../../generic/edit/ctrl';
import { RegionEditStore } from '../ctrl';

const AuthorizationComp: React.FC = () => {
  const ctrl = useCommonEditStore<RegionEditStore>();
  const __ = useI18N();

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
};

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

addPagePlugin({
  component: AuthorizationComp,
  name: 'region_applications',
  sidebarTitle: 'Applications',
  target: TargetForm.region_edit,
  order: 0,
  displayInModal: true,
});
