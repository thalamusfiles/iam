import React from 'react';
import ReactDOM from 'react-dom';
import { TableHead } from "./types/TableHead";

export class TableResizer extends React.Component<{ head: TableHead }> {
    screenX: number = 0;
    onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        this.screenX = e.screenX;
    }
    onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const diff = e.screenX - this.screenX;
        const parentWidth = ReactDOM.findDOMNode(this)?.parentElement?.offsetWidth;
        this.props.head.maxWidth = (this.props.head.maxWidth || parentWidth || 0) + diff;
    }
    render() {

        return (
            <div className="float-right">
                <div className="table-resizer"
                    draggable={true}
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                />
            </div>
        );
    }
}