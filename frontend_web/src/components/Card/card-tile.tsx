import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';

type TCardTileProps = {
  title: string;
  subtitle: string;
  variant?: string;
  faicon?: any;
  onClick?: Function;
};

const TCardTile: React.FC<TCardTileProps> = (props: TCardTileProps) => {
  return (
    <Card style={{ width: '18rem' }} className="pointer" border={props.variant} onClick={() => props.onClick && props.onClick()}>
      <Card.Header>
        <Card.Title className={'float-end text-' + props.variant}>{props.faicon && <FontAwesomeIcon icon={props.faicon} size="2x" />}</Card.Title>
        <Card.Title>{props.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.subtitle}</Card.Subtitle>
      </Card.Header>
    </Card>
  );
};

export default TCardTile;
