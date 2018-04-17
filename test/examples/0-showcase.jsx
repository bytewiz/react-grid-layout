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
    create: {},
    startPoint: null,
    endPoint: null,
    reservedPoints: [],
  };

  componentDidMount() {
    this.setState({mounted: true});
  }

  getReservedGrid(grids, col) {
    const reservedArray = [];
    grids.forEach((grid) => {
      if (grid.isDraggable !== false) {
        for (let column = grid.x; column < (grid.x + grid.w); column++) {
          if(column === col) {
            for (let row = grid.y; row < (grid.y + grid.h); row++) {
              reservedArray.push(row);
            }
          }
        }
      }
    });
    return reservedArray;
  }

  filterPoints(items, endPoint, flag) {
    const listOfCreate = Object.keys(items);
    console.log(listOfCreate);
    if(flag) {
      listOfCreate.forEach((item) => {
        if (parseInt(item.split('-')[2]) > endPoint.y) {
          delete items[item];
        }
      });
    }
    console.log(items);
    return items;
  }

  isOverLapped(item, flag) {
    let overLappedFlag = false;
    if(flag) {
      overLappedFlag = this.state.reservedPoints.filter((y) => {
        if(this.state.startPoint.y < y && item.y >= y) {
          return y;
        }
      });
    }
    if(overLappedFlag.length > 0) {
      return false;
    }
    return true;
  }

  onMouseEnter = (e, item) => {
    const listOfCreate = Object.keys(this.state.create);
    if (this.state.mouseIsDown &&
      (item.y > this.state.create[listOfCreate[listOfCreate.length - 1]].y || item.y < this.state.create[listOfCreate[listOfCreate.length - 1]].y)
    ) {
      if(this.state.endPoint.y >= this.state.startPoint.y) {
        if (this.isOverLapped(item, true)) {
          const create = this.filterPoints(this.state.create, item, true);
          console.log(create);
          this.setState({
            endPoint: item,
            create: { ...create, [item.i]: item },
          });
        }
      }
    }
  }

  onMouseDown = (e, current) => {
    this.setState({
      create: {[current.i]: current},
      startPoint: current,
      endPoint: current,
      mouseIsDown: true,
      reservedPoints: this.getReservedGrid(this.props.layout, current.x),
    });
  }

  onMouseUp = (e) => {
    const listOfCreate = Object.keys(this.state.create);
    console.log(this.state);
    const y = this.state.create[listOfCreate[0]].y;
    const x = this.state.create[listOfCreate[0]].x;
    const h = this.state.create[listOfCreate[listOfCreate.length - 1]].y - this.state.create[listOfCreate[0]].y;
    this.setState({ mouseIsDown: false, create: {}, startPoint: null, endPoint: null });
    this.props.onLayoutChange([...this.props.layout.filter(item => !this.state.create[item.i]), {i: `${x}${y}${h}b`, x: x, y: y, w: 1, h: h + 1 }], 'MOUSEUP');
  }

  generateDOM() {
    const layout = this.props.layout.map((l) => {
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
            : <span className={"text"} style={{textAlign: 'left'}}>0{l.y}:00 ({l.i})</span>
          }
        </div>);
    });
    return layout;
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  addEmptyItems(e) {
    this.props.onLayoutChange(e, 'ADD_STATIC');
  }
  addEmptyItems = this.addEmptyItems.bind(this);

  onLayoutChange = (layout) => {
    this.props.onLayoutChange(layout);
  };

  render() {
    return (
      <div style={{ marginTop: '50px' }}>
        <ResponsiveReactGridLayout
          {...this.props}
          layout={this.props.layout}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          margin={[0, 0]}
          onMouseLeave={(e) => this.setState({ mouseIsDown: false, create: {} })}
          measureBeforeMount={false}
          onDragStart={(e) => this.props.onLayoutChange(e.filter(item => !(item.isDraggable === false)), 'DRAG_START')}
          onResizeStart={(e) => this.props.onLayoutChange(e.filter(item => !(item.isDraggable === false)), 'RESIZE_START')}
          onDragStop={this.addEmptyItems}
          onResizeStop={this.addEmptyItems}
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

if (require.main === module) {
  require('../test-hook.jsx')(module.exports);
}
