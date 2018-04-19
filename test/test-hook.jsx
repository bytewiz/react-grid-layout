import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
require('style-loader!css-loader!../css/styles.css');
require('style-loader!css-loader!../examples/example-styles.css');
typeof window !== "undefined" && (window.React = React); // for devtools

const backendData = {
    "event": {
        "_id": "events/2296982",
        "_key": "2296982",
        "timeZone": 60,
        "title": "programme singleton"
    },
    "colors": [
        {
            "_id": "colors/2296999",
            "_key": "2296999",
            "primary": "#c5e77c",
            "secondary": "#ffffff",
            "title": "Lime"
        },
        {
            "_id": "colors/2296996",
            "_key": "2296996",
            "primary": "#49adf3",
            "secondary": "#ffffff",
            "title": "Sky"
        },
        {
            "_id": "colors/2296990",
            "_key": "2296990",
            "primary": "#efc1a5",
            "secondary": "#ffffff",
            "title": "Sand"
        },
        {
            "_id": "colors/2296986",
            "_key": "2296986",
            "primary": "#8900fa",
            "secondary": "#ffffff",
            "title": "Purple"
        },
        {
            "_id": "colors/2297002",
            "_key": "2297002",
            "primary": "#fc7054",
            "secondary": "#ffffff",
            "title": "Orange"
        },
        {
            "_id": "colors/2296993",
            "_key": "2296993",
            "primary": "#142bfa",
            "secondary": "#ffffff",
            "title": "Ocean"
        }
    ],
    "areas": [],
    "rooms": [],
    "tracks": [
        {
            "_id": "tracks/2297005",
            "_key": "2297005",
            "color": "colors/2296993",
            "title": "Stage 1"
        },
        {
            "_id": "tracks/2",
            "_key": "2297155",
            "color": "colors/2296999",
            "title": "Stage 2"
        },
        {
            "_id": "tracks/2297155",
            "_key": "2297155",
            "color": "colors/2296999",
            "title": "Stage 3"
        }
    ],
    "splits": [
        {
            "_id": "splits/2297009",
            "_key": "2297009",
            "areas": [],
            "finish": "2018-04-20T15:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T07:00:52.000Z",
            "title": "Day 1",
            "tracks": [
                "tracks/2297005",
                "tracks/2",
                "tracks/2297155",
            ]
        }
    ],
    "speakers": [],
    "tasks": [
        {
            "_id": "programmeTasks/2297076",
            "_key": "2297076",
            "description": "",
            "finish": "2018-04-20T10:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T09:00:52.000Z",
            "title": "Task 1",
            "tracks": [
                "tracks/2297005"
            ],
            "speakers": []
        },
        {
            "_id": "programmeTasks/2297178",
            "_key": "2297178",
            "description": "",
            "finish": "2018-04-20T08:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T07:15:52.000Z",
            "title": "Task 2",
            "tracks": [
                "tracks/2297155"
            ],
            "speakers": []
        },
        {
            "_id": "programmeTasks/2297097",
            "_key": "2297097",
            "description": "",
            "finish": "2018-04-20T11:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T10:15:52.000Z",
            "title": "Task 3",
            "tracks": [
                "tracks/2297005"
            ],
            "speakers": []
        },
        {
            "_id": "programmeTasks/2297217",
            "_key": "2297217",
            "description": "",
            "finish": "2018-04-20T10:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T09:00:52.000Z",
            "title": "Task 4",
            "tracks": [
                "tracks/2297155"
            ],
            "speakers": []
        },
        {
            "_id": "programmeTasks/2297055",
            "_key": "2297055",
            "description": "",
            "finish": "2018-04-20T08:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T07:00:52.000Z",
            "title": "Task 5",
            "tracks": [
                "tracks/2297005"
            ],
            "speakers": []
        },
        {
            "_id": "programmeTasks/2297061",
            "_key": "2297061",
            "description": "",
            "finish": "2018-04-20T09:00:52.000Z",
            "rooms": [],
            "start": "2018-04-20T08:00:52.000Z",
            "title": "Task 6",
            "tracks": [
                "tracks/2297005",
            ],
            "speakers": []
        },
        {
            "_id": "programmeTasks/2297239",
            "_key": "2297239",
            "description": "",
            "finish": "2018-04-20T10:30:52.000Z",
            "rooms": [],
            "start": "2018-04-20T10:15:52.000Z",
            "title": "Task 7",
            "tracks": [
                "tracks/2297155"
            ],
            "speakers": []
        }
    ]
};

const initLayout = [];

module.exports = function(Layout) {
  class ExampleLayout extends React.Component {

    state = {
      cols: 2,
      maxRows: 30,
      rowHeight: 30,
      gridDuration: 5,
      layout: [],
    };

    componentWillMount() {
      this.getSplitInfo(0);
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

    removeTrack() {
      this.setState({
        cols: this.state.cols - 1,
      }, () => {
        this.onLayoutChange(this.state.layout, 'ADD_STATIC');
      });
    }
    removeTrack = this.removeTrack.bind(this);

    render(){
      return (
        <div>
          <button onClick={this.addTrack}>Add Track</button>
          <button onClick={this.removeTrack}>Remove Track</button>
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
