import React from 'react';
import ReactDOM from 'react-dom';
require('style-loader!css-loader!../css/styles.css');
require('style-loader!css-loader!../examples/example-styles.css');
typeof window !== "undefined" && (window.React = React); // for devtools

const initLayout = [
  { x: 0, y: 0, w: 1, h: 1, i: 'u' },
  { x: 1, y: 0, w: 1, h: 1, i: 'lol' },
  { x: 1, y: 7, w: 1, h: 1, i: 'john6' },
  { x: 1, y: 30, w: 1, h: 1, i: 'Footer' },
];

module.exports = function(Layout) {
  class ExampleLayout extends React.Component {

    state = {
      cols: 2,
      maxRows: 30,
      layout: [],
    };

    componentWillMount() {
      this.onLayoutChange(initLayout, 'ADD_STATIC');
    }

    getReservedGrid(grids) {
      const reservedArray = [];
      grids.forEach((grid) => {
        for (let column = grid.x; column < (grid.x + grid.w); column++) {
          for (let row = grid.y; row < (grid.y + grid.h); row++) {
            reservedArray.push(`${column}-${row}`);
          }
        }
      });
      return reservedArray;
    }

    onLayoutChange = (layout, type) => {
      if (type === 'ADD_STATIC') {
        const gridItems = [];
        const reservedArray = this.getReservedGrid(layout);
        for (let column = 0; column < this.state.cols; column++) {
          for (let row = 0; row < this.state.maxRows; row++) {
            if (reservedArray.indexOf(`${column}-${row}`) < 0) {
              gridItems.push({
                x: column,
                y: row,
                w: 1,
                h: 1,
                i: `item-${column}-${row}`,
                isDraggable: false,
                isResizable: false
              });
            }
          }
        }
        const layoutArray = [...gridItems, ...layout];
        this.setState({layout: layoutArray});
      } else {
        if(typeof type !== 'undefined') {
          this.setState({ layout });
        }
      }
    };

    stringifyLayout() {
      return this.state.layout.map(function(l) {
        return <div className="layoutItem" key={l.i}><b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]</div>;
      });
    }

    render(){
      return (
        <div>
          {/* <div
            className="layoutJSON"
            style={{ minHeight: '40px' }}
          >
            Displayed as <code>[x, y, w, h]</code>:
            <div className="columns">
              {this.stringifyLayout()}
            </div>
          </div> */}
          <Layout
            layout={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            cols={this.state.cols}
            maxRows={this.state.maxRows}
          />
        </div>
      );
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById('content');
    const gridProps = window.gridProps || {};
    ReactDOM.render(React.createElement(ExampleLayout, gridProps), contentDiv);
  });
};
