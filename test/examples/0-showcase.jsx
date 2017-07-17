import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactGridLayout, {WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(ReactGridLayout);

class ShowcaseLayout extends React.Component {

  static propTypes = {
    onLayoutChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 2,
    maxRows: 30,
    initialLayout: [],
    mouseIsDown: false,
    create: {},
  };

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
    create: {}
  };

  componentDidMount() {
    this.setState({mounted: true});
  }

  onMouseEnter = (e, item) => {
    const listOfCreate = Object.keys(this.state.create);
    if(this.state.mouseIsDown && item.y > this.state.create[listOfCreate[listOfCreate.length - 1]].y) {
      this.setState({ create: { ...this.state.create, [item.i]: item }});
    }
  }

  onMouseDown = (e, current) => {
    this.setState({ create: {[current.i]: current}, mouseIsDown: true });
  }

  onMouseUp = (e) => {
    // find coordinates to create item from
    const listOfCreate = Object.keys(this.state.create);
    const y = this.state.create[listOfCreate[0]].y;
    const x = this.state.create[listOfCreate[0]].x;
    const h = this.state.create[listOfCreate[listOfCreate.length - 1]].y - this.state.create[listOfCreate[0]].y;
    this.setState({ mouseIsDown: false });
    this.props.onLayoutChange([...this.props.layout.filter(item => !this.state.create[item.i]), {i: `${x}${y}${h}b`, x: x, y: y, w: 1, h: h + 1 }], 'MOUSEUP');
  }

  generateDOM() {

    return this.props.layout.map((l) => {
      const creatable = l.isDraggable === false;
      return (
        <div
          key={l.i}
          className={creatable ? this.state.create[l.i] ? 'marked' : 'static' : ''}
          onMouseUp={(e) => creatable && this.onMouseUp(e)}
          onMouseDown={(e) => creatable && this.onMouseDown(e, l)}
          onMouseEnter={(e) => creatable && this.onMouseEnter(e, l)}
        >
          {creatable ?
            <span
              className={creatable ? "funky" : "text"}
              title="This item is static and cannot be removed or resized."
            />
            : <span className={"text"} style={{textAlign: 'left'}}>0{l.y}:00</span>
          }
        </div>);
    });
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout = () => {
    this.setState({
      layouts: {lg: generateLayout()}
    });
  };

  render() {
    return (
      <div>
        <div>Current Breakpoint: {this.state.currentBreakpoint} ({this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <button onClick={this.onNewLayout} style={{ marginBottom: '50px' }}>Generate New Layout</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layout={this.props.layout}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={(e) => this.props.onLayoutChange(e, 'LOL')}
          margin={[0, 0]}
          onMouseLeave={(e) => this.setState({ mouseIsDown: false, create: {} })}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          onDragStart={(e) => this.props.onLayoutChange(e.filter(item => !(item.isDraggable === false)), 'DRAG START')}
          onDragStop={(e) => {
            this.props.onLayoutChange( [...this.props.layout, { x: 0, y: 7, w: 1, h: 1, i: 'a', isDraggable: false, isResizable: false }], 'DRAG STOP');
          }}
          preventCollision={true}
          verticalCompact={false}
          useCSSTransforms={false}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

module.exports = ShowcaseLayout;

// function fillLayout() {
//   return [].concat.apply([], _.map(_.range(0, 2), (col) => {
//     return _.map(_.range(0, 20), (item) => {
//       return {
//         x: col,
//         y: item,
//         w: 1,
//         h: 1,
//         isDraggable: false,
//         isResizable: false,
//         i: `${col}-${item}-bob`,
//       };
//     });
//   }));
// }

function generateLayout() {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: _.random(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 1,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

if (require.main === module) {
  require('../test-hook.jsx')(module.exports);
}
