import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import Layout from './layout';
import { backendData } from './data';

require('style-loader!css-loader!../css/styles.css');
require('style-loader!css-loader!../css/example-styles.css');
typeof window !== "undefined" && (window.React = React); // for devtools

class GridContainer extends Component {
  state = {
    cols: 2,
    maxRows: 30,
    rowHeight: 30,
    gridDuration: 5,
    currentSplit: 0,
    layout: [],
  };

  componentWillMount() {
    this.getSplitInfo(this.state.currentSplit);
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
              isResizable: false,
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

  onItemUpdate(item) {
    const startTime = item.y * this.state.gridDuration;
    const endTime = (item.y + item.h) * this.state.gridDuration;
    const currentSplit = backendData.splits[this.state.currentSplit];
  }
  onItemUpdate = this.onItemUpdate.bind(this);

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

  getLayout(tracks, tasks, split) {
    const layout = [];
    tasks.forEach((task) => {
      const track = _.intersection(task.tracks, tracks);
      if(track.length > 0) {
        const startTime = moment(task.start);
        const endTime = moment(task.finish);
        const splitTime = moment(split.start);
        const startPoint = startTime.diff(splitTime, 'minutes')/this.state.gridDuration;
        const height = endTime.diff(startTime, 'minutes')/this.state.gridDuration;
        const col = tracks.indexOf(task.tracks[0]);
        layout.push({
          x: col,
          y: startPoint,
          w: track.length,
          h: height,
          i: task.title,
        });
      }
    });
    return layout;
  }
  getLayout = this.getLayout.bind(this);

  getSplitInfo(splitId) {
    const currentSplit = backendData.splits[splitId];
    const duration = moment(currentSplit.finish).diff(moment(currentSplit.start));
    const d = moment.duration(duration).asMinutes();
    this.setState({
      cols: currentSplit.tracks.length,
      maxRows: d/this.state.gridDuration,
      startTime: currentSplit.start,
      endTime: currentSplit.finish,
      layout: this.getLayout(currentSplit.tracks, backendData.tasks, currentSplit),
      currentTracks: currentSplit.tracks,
      tracks: backendData.tracks,
    }, () => {
      this.onLayoutChange(this.state.layout, 'ADD_STATIC');
    });
  }
  getSplitInfo = this.getSplitInfo.bind(this);

  addTrack() {
    this.setState({
      cols: this.state.cols + 1,
    }, () => {
      this.onLayoutChange(this.state.layout, 'ADD_STATIC');
    });
  }
  addTrack = this.addTrack.bind(this);

  deleteTrack(id) {
    const index = backendData.splits[this.state.currentSplit].tracks.indexOf(id);
    backendData.splits[this.state.currentSplit].tracks.splice(index, 1);
    this.getSplitInfo(this.state.currentSplit);
  }
  deleteTrack = this.deleteTrack.bind(this);

  openDrawer(id) {
    console.log(id);
  }
  openDrawer = this.openDrawer.bind(this);

  render(){
    return (
      <div>
        <button onClick={this.addTrack}>Add Track</button>
        <Layout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          cols={this.state.cols}
          maxRows={this.state.maxRows}
          rowHeight={this.state.rowHeight}
          gridDuration={this.state.gridDuration}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          currentTracks={this.state.currentTracks}
          tracks={this.state.tracks}
          deleteTrack={this.deleteTrack}
          onItemUpdate={this.onItemUpdate}
          openDrawer={this.openDrawer}
        />
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const contentDiv = document.getElementById('content');
  ReactDOM.render(<GridContainer />, contentDiv);
});