import React from 'react';
import Form from 'react-bootstrap/Form';
import { WmsFormProps } from './index';

export function WmsBooleanFormControl(props: WmsFormProps) {
    return (
        <Form.Check autoComplete="off" type="switch"
            id={props.name}
            name={props.name}
            label={props.placeholder}
            value={props.value || ""}
            checked={props.checked}
            onChange={(event) =>
                props.onChange
                && props.onChange(event.target.checked, event.target.value, event)
            }
        />
    );
}