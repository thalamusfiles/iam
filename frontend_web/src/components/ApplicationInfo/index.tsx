import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const ApplicationInfo: React.FC<{ region?: string; application?: string }> = ({ region, application }) => {
  return (
    <ButtonGroup style={{ float: 'right' }} id="application_info">
      <Button size="sm" variant="outline-secondary">
        {region || 'Global System'}
      </Button>
      <Button size="sm" variant="outline-info">
        {application || 'Root'}
      </Button>
    </ButtonGroup>
  );
};

export default ApplicationInfo;
