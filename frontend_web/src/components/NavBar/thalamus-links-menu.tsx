import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { getLinkTo } from '../../commons/route';
import { thalamusLinks } from '../../config/thalamus.data';

const ThalamusLinksMenu: React.FC = () => {
  return (
    <NavDropdown className="nav_menu_thalamus" title={<FontAwesomeIcon icon={'table-cells'} />}>
      <ul>
        {Object.values(thalamusLinks).map((link, idx) => (
          <li className="text-center">
            <a className="app_link" href={getLinkTo(link.link)} target="_blank" rel="noreferrer" key={idx}>
              <span className={'icon ' + link.name.toLocaleLowerCase()}></span>
              <span>{link.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </NavDropdown>
  );
};

export default ThalamusLinksMenu;
