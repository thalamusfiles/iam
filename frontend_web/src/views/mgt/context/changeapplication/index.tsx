import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useI18N } from '../../../../commons/i18';
import { CommonEditContextProvider, useCommonEditStore } from '../../../generic/edit/ctrl';
import { ApplicationEditStore } from './ctrl';

const ChangeApplication: React.FC = () => {
  const ctrl = new ApplicationEditStore();

  useEffect(() => {
    ctrl.loadApplications();
  });

  return (
    <CommonEditContextProvider value={ctrl}>
      <ChangeApplicationProvided />
    </CommonEditContextProvider>
  );
};

const ChangeApplicationProvided: React.FC = observer(() => {
  const ctrl = useCommonEditStore<ApplicationEditStore>();

  const __ = useI18N();
  return (
    <>
      <h2>{__('changeapplication.title')}</h2>
      <p>{__('changeapplication.subtitle')}</p>

      <Table responsive striped hover size="sm">
        <thead>
          <tr>
            <th>{__('changeapplication.application')}</th>
            <th>{__('changeapplication.description')}</th>
          </tr>
        </thead>
        <tbody>
          {ctrl.applications.map((application: any, idx) => (
            <tr key={idx} className="pointer" onClick={() => ctrl.changeApplication(application)}>
              <td>{application.name}</td>
              <td>{application.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
});

export default ChangeApplication;
