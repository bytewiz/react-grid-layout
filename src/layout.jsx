import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import ReactGridLayout, {WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(ReactGridLayout);

class ShowcaseLayout extends React.Component {

  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 2,
    maxRows: 30,
    initialLayout: [],
    create: {},
  };

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
    create: {},
    startPoint: null,
    endPoint: null,
    isMouseDown: false, 
    isDragging: false,
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

  // flag parameter set to true if start point > end point
  generatePoints(startPoint, endPoint, flag) {
    const items = {};
    if(flag) {
      for (let index = startPoint.y; index <= endPoint.y; index++) {
        items[`item-${startPoint.x}-${index}`] = {
          w: 1,
          h: 1,
          x: startPoint.x,
          y: index,
        };
      }
    } else {
      for (let index = endPoint.y; index <= startPoint.y; index++) {
        items[`item-${startPoint.x}-${index}`] = {
          w: 1,
          h: 1,
          x: startPoint.x,
          y: index,
        };
      }
    }
    return items;
  }
  // flag parameter set to true if start point > end point
  isOverLapped(item, flag) {
    let overLappedFlag = false;
    if(flag) {
      overLappedFlag = this.state.reservedPoints.filter((y) => {
        if(this.state.startPoint.y < y && item.y >= y) {
          return y;
        }
      });
    } else {
      overLappedFlag = this.state.reservedPoints.filter((y) => {
        if (this.state.startPoint.y > y && item.y <= y) {
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
    if (this.state.isMouseDown) {
      if (item.y < this.state.startPoint.y) {
        if (this.isOverLapped(item, false)) {
          const create = this.generatePoints(this.state.startPoint, item, false);
          this.setState({
            endPoint: item,
            create,
          });
        }
      } else if (item.y >= this.state.startPoint.y) {
        if (this.isOverLapped(item, true)) {
          const create = this.generatePoints(this.state.startPoint, item, true);
          this.setState({
            endPoint: item,
            create,
          });
        }
      }
    }
  }

  buttonClick(e) {
    console.log('Button Click')
    e.preventDefault();
    e.stopPropagation();
  }
  buttonClick = this.buttonClick.bind(this);

  onMouseDown = (e, current) => {
    this.setState({
      create: {[current.i]: current},
      startPoint: current,
      endPoint: current,
      isMouseDown: true,
      reservedPoints: this.getReservedGrid(this.props.layout, current.x),
    });
  }

  onMouseUp(e) {
    if (this.state.isMouseDown) {
      const listOfCreate = Object.keys(this.state.create);
      const x = this.state.create[listOfCreate[0]].x;
      let y = this.state.create[listOfCreate[0]].y;
      let h = this.state.create[listOfCreate[listOfCreate.length - 1]].y - this.state.create[listOfCreate[0]].y;
      if (h < 0) {
        y = this.state.create[listOfCreate[listOfCreate.length - 1]].y;
        h = Math.abs(h);
      }
      this.setState({ isMouseDown: false, create: {}, startPoint: null, endPoint: null });
      this.props.onLayoutChange([...this.props.layout.filter(item => !this.state.create[item.i]), {i: `${x}${y}${h}b`, x: x, y: y, w: 1, h: h + 1 }], 'MOUSEUP');
    } else if(this.state.cursorPosition === `${e.clientX}-${e.clientY}`) {
      this.props.openDrawer('Open Drawer');
    }
  }
  onMouseUp = this.onMouseUp.bind(this);

  generateDOM() {
    const layout = this.props.layout.map((l) => {
      const creatable = l.isDraggable === false;
      const startTime = moment(this.props.startTime).add((l.y * this.props.gridDuration), 'minutes').format('HH:mm');
      const endTime = moment(this.props.startTime).add(((l.y + l.h) * this.props.gridDuration), 'minutes').format('HH:mm');
      return (
        <div
          key={l.i}
          className={creatable ? (this.state.create[l.i] ? 'marked' : 'static') : ''}
          onMouseDown={(e) => creatable && this.onMouseDown(e, l)}
          onMouseEnter={(e) => creatable && this.onMouseEnter(e, l)}
        >
          <div onMouseUp={this.onMouseUp} style={{ height: '100%' }}>
            {creatable ?
              <div
                className={creatable ? "creatable" : "text"}
                title="This item is static and cannot be removed or resized."
              >
                {this.state.isMouseDown ? 
                  <div className="time">
                    {this.state.isMouseDown ? endTime : startTime }
                  </div> :
                  <div className="default-grid">
                    {this.state.isMouseDown ? endTime : startTime } Click and Drag to create Session
                  </div>
                }
              </div>
              : <div className={"text"} style={{textAlign: 'left'}}>
                {startTime} - {endTime}<span> ({l.i})</span>
                <button onMouseDown={this.buttonClick}>Click</button>
              </div>
            }
          </div>
        </div>
      );
    });
    return layout;
  }
  generateDOM = this.generateDOM.bind(this);

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  startEvent(items, item, newItem, i, e) {
    this.setState({
      cursorPosition: `${e.clientX}-${e.clientY}`,
    }, () => {
      this.props.onLayoutChange(items.filter(item => !(item.isDraggable === false)), 'START_EVENT');
    });
  }
  startEvent = this.startEvent.bind(this);

  stopEvent(e, item, newItem) {
    setTimeout(() => {
      this.props.onItemUpdate(newItem);
      this.props.onLayoutChange(e, 'ADD_STATIC');
    }, 100);
  }
  stopEvent = this.stopEvent.bind(this);

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }
  onLayoutChange = this.onLayoutChange.bind(this);

  renderTime() {
    const startTime = moment(this.props.startTime);
    const endTime = moment(this.props.endTime);
    const difference = startTime.diff(endTime, 'hours');
    const timeHeight = this.props.rowHeight * (60 / this.props.gridDuration);
    const time = [<li style={{ height: timeHeight }}>{startTime.format('HH:mm')}</li>];
    for (var i = 0; i < (Math.abs(difference) - 1); i++) {
      time.push(
        <li style={{ height: timeHeight }}>{startTime.add(1, 'hour').format('HH:mm')}</li>
      );
    }
    return (
      <div className="time-container">
        <ul>
          {time}
        </ul>
      </div>
    )
  }
  renderTime = this.renderTime.bind(this);
  
  renderTracks() {
    return (
      <div className="track-container">
        <ul>
          {
            this.props.currentTracks.map((track) => {
              const currentTrack = this.props.tracks.find((t) => t._id === track);
              return (
                <li key={currentTrack._id} style={{ width: `${100/this.props.currentTracks.length}%`}}>
                  {currentTrack.title}
                  <button onClick={() => {this.props.deleteTrack(currentTrack._id)}}>Delete</button>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
  renderTracks = this.renderTracks.bind(this);

  render() {
    return (
      <div>
        <div className="grid-header">
          <div className="grid-timeZone">GMT +5</div>
          {
            this.renderTracks()
          }
        </div>
        <div>  
          {
            this.renderTime()
          }
          <div className="grid-container">
            <ResponsiveReactGridLayout
              {...this.props}
              staticHeight={true}
              layout={this.props.layout}
              onBreakpointChange={this.onBreakpointChange}
              onLayoutChange={this.onLayoutChange}
              margin={[0, 0]}
              onMouseUp={this.onMouseUp}
              onMouseLeave={(e) => this.setState({ isMouseDown: false, create: {} })}
              measureBeforeMount={false}
              onDragStart={this.startEvent}
              onResizeStart={this.startEvent}
              onDragStop={this.stopEvent}
              onResizeStop={this.stopEvent}
              preventCollision={true}
              verticalCompact={false}
              useCSSTransforms={false}
            >
              {this.generateDOM()}
            </ResponsiveReactGridLayout>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ShowcaseLayout;