import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren } from 'react';
import Card from 'react-bootstrap/Card';
import { Color, Variant } from 'react-bootstrap/types';

type TCardProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  faicon?: any;
  bg?: Variant;
  border?: Variant;
  text?: Color;
  onClick?: Function;
}>;

const TCard: React.FC<TCardProps> = (props: TCardProps) => {
  return (
    <Card style={{ width: '18rem' }} bg={props.bg} border={props.border} text={props.text} onClick={() => props.onClick && props.onClick()}>
      <Card.Header>
        <Card.Title className={'float-end text-' + props.border}>{props.faicon && <FontAwesomeIcon icon={props.faicon} size="2x" />}</Card.Title>
        <Card.Title>{props.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.subtitle}</Card.Subtitle>
      </Card.Header>
      {props.children}
    </Card>
  );
};

export default TCard;
