import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useI18N } from '../../commons/i18';
import { historyPush } from '../../commons/route';
import { useUserStore } from '../../store/userContext';
import { ApplicationInfoCtrl, ApplicationInfoProvider, useApplicationInfoStore } from './ctrl';

const ApplicationInfo: React.FC = observer(() => {
  const ctrl = new ApplicationInfoCtrl();
  const userCtx = useUserStore();

  useEffect(() => {
    ctrl.setParams(userCtx.application?.uuid || userCtx.user.applicationLogged);
  });

  return (
    <ApplicationInfoProvider value={ctrl}>
      <ApplicationInfoProvided />
    </ApplicationInfoProvider>
  );
});

const ApplicationInfoProvided: React.FC = observer(() => {
  const __ = useI18N();
  const ctrl = useApplicationInfoStore();

  return (
    <ButtonGroup style={{ float: 'right' }} id="application_info">
      <Button
        size="sm"
        variant="outline-secondary"
        title={__('login.application')}
        onClick={() => {
          historyPush('change_application', { inModal: true });
        }}
      >
        {ctrl.appInfo?.name || __('info.notloaded')}
      </Button>
    </ButtonGroup>
  );
});

export default ApplicationInfo;
