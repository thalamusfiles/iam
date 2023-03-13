import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { IconsDef } from '../../commons/consts';

type Sizes = 'lg' | 'md' | 'sm' | 'xs';

export interface LoaderProps<As extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>> {
  /** The prefix of the component CSS class */
  classPrefix?: string;

  /** Additional classes */
  className?: string;

  /** You can use a custom element for this component */
  as?: As;

  /** Show/Display loader  */
  show?: boolean;

  /** Centered in the container */
  center?: boolean;

  /** Whether the background is displayed */
  backdrop?: boolean;

  /** An alternative dark visual style for the Loader */
  inverse?: boolean;

  /** The icon is displayed vertically with the text */
  vertical?: boolean;

  /** Custom descriptive text */
  content?: React.ReactNode;

  /** The speed at which the loader rotates */
  speed?: 'normal' | 'fast' | 'slow';

  /** A loader can have different sizes */
  size?: Sizes;
}

/*
type ReplaceProps<Inner extends React.ElementType, P= unknown> = Omit<React.ComponentPropsWithRef<Inner>, P> & P;

interface RsRefForwardingComponent<T extends React.ElementType, P = unknown> {
  <As extends React.ElementType = T>(props: React.PropsWithChildren<ReplaceProps<As, LoaderProps<As> & P>>, context?: any): React.ReactElement | null;
  propTypes?: any;
  contextTypes?: any;
  displayName?: string;
}
*/
const Loader /*: RsRefForwardingComponent<'div', LoaderProps>*/ = React.forwardRef((props: LoaderProps<any>, ref) => {
  const {
    as: Component = 'div',
    show,
    classPrefix = 'rs-loader',
    className,
    inverse,
    backdrop,
    speed = 'normal',
    center,
    vertical,
    content,
    size,
    ...rest
  } = props;

  //Se não for informado a propriedade show ele deve exibir o conteúdo
  //Se for === false não exibe
  if (show === false) return null;

  const hasContent = !!content;

  const classes = classNames(className, `${classPrefix}-wrapper`, `${classPrefix}-speed-${speed}`, {
    [classPrefix + '-size']: size,
    [classPrefix + '-backdrop-wrapper']: backdrop,
    [classPrefix + '-has-content']: hasContent,
    [classPrefix + '-vertical']: vertical,
    [classPrefix + '-inverse']: inverse,
    [classPrefix + '-center']: center,
  });

  return (
    <Component role="progressbar" {...rest} ref={ref} className={classes}>
      {backdrop && <div className={`${classPrefix}-backdrop`} />}
      <div className={classPrefix}>
        {!hasContent && (
          <span className={`${classPrefix}-content`}>
            <strong>
              <FontAwesomeIcon size="xs" icon={IconsDef.refresh} spin /> Loading
            </strong>
          </span>
        )}
        {hasContent && <span className={`${classPrefix}-content`}>{content}</span>}
      </div>
    </Component>
  );
});

Loader.displayName = 'Loader';
Loader.propTypes = {
  //as: PropTypes.elementType,
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  show: PropTypes.bool,
  center: PropTypes.bool,
  backdrop: PropTypes.bool,
  inverse: PropTypes.bool,
  vertical: PropTypes.bool,
  content: PropTypes.node,
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']),
  speed: PropTypes.oneOf(['normal', 'fast', 'slow']),
};

export default Loader;
