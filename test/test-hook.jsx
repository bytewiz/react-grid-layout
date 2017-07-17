import React from 'react';
import ReactDOM from 'react-dom';
require('style-loader!css-loader!../css/styles.css');
require('style-loader!css-loader!../examples/example-styles.css');
typeof window !== "undefined" && (window.React = React); // for devtools

module.exports = function(Layout) {
  class ExampleLayout extends React.Component {

    state = {
      layout: [
        { x: 0, y: 0, w: 1, h: 1, i: 'u' },
        { x: 1, y: 0, w: 1, h: 1, i: 'lol' },
        { x: 1, y: 1, w: 1, h: 1, i: 'john', funky: true, isDraggable: false, isResizable: false },
        { x: 1, y: 2, w: 1, h: 1, i: 'john1', funky: true, isDraggable: false, isResizable: false },
        { x: 1, y: 3, w: 1, h: 1, i: 'john2', funky: true, isDraggable: false, isResizable: false },
        { x: 1, y: 4, w: 1, h: 1, i: 'john3', funky: true, isDraggable: false, isResizable: false },
        { x: 1, y: 5, w: 1, h: 1, i: 'john4', funky: true, isDraggable: false, isResizable: false },
        { x: 1, y: 6, w: 1, h: 1, i: 'john5', funky: true, isDraggable: false, isResizable: false },
        { x: 1, y: 7, w: 1, h: 1, i: 'john6' },
        { x: 0, y: 1, w: 1, h: 1, i: 'bob', funky: true, isDraggable: false, isResizable: false },
        { x: 0, y: 2, w: 1, h: 1, i: 'bob1', funky: true, isDraggable: false, isResizable: false },
        { x: 0, y: 3, w: 1, h: 1, i: 'bob2', funky: true, isDraggable: false, isResizable: false },
        { x: 0, y: 4, w: 1, h: 1, i: 'bob3', funky: true, isDraggable: false, isResizable: false },
        { x: 0, y: 5, w: 1, h: 1, i: 'bob4', funky: true, isDraggable: false, isResizable: false },
        { x: 0, y: 6, w: 1, h: 1, i: 'bob5', funky: true, isDraggable: false, isResizable: false },
        { x: 0, y: 7, w: 1, h: 1, i: 'bob6', funky: true, isDraggable: false, isResizable: false },
      ],
    };

    onLayoutChange = (layout, type) => {


      if(type) {
        // console.log('newLayout', layout, type);
        this.setState({layout: layout});
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
          <div
            className="layoutJSON"
            style={{ minHeight: '40px' }}
          >
            Displayed as <code>[x, y, w, h]</code>:
            <div className="columns">
              {this.stringifyLayout()}
            </div>
          </div>
          <Layout layout={this.state.layout} onLayoutChange={this.onLayoutChange} />
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
