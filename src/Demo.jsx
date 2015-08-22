import React from 'react';

function mapObj(o, f) {
  return Object.keys(o).reduce((acc, key) => {
    acc[key] = f(o[key], key);
    return acc;
  }, {});
}

// ignored shorthands:
// flexFlow for wrap + direction
// flex for grow + shrink + basis

const flexParent = {
  display: ['flex', 'inline-flex'],
  flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
  flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
  justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
  alignItems: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
  alignContent: ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'],

  height: [180],
  width: [300],
  outline: ['1px solid'],
};

const flexChild = {
  // order: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  flexGrow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  flexShrink: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
  flexBasis: ['auto', 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],

  alignSelf: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],

  height: [40],
  width: [70],
  outline: ['1px solid'],
};

const defParent = mapObj(flexParent, val => val[0]);
const defChild = mapObj(flexChild, val => val[0]);

function construct(currStruct, selectedChild, prop, handleParentClick, handleChildClick) {
  const {children, ...rest} = currStruct;

  return (
    <div>
      <div style={{position: 'absolute'}}>
        {selectedChild == null && rest[prop[0]]}
      </div>

      <div
        style={{
          backgroundColor: selectedChild == null ? 'lightpink' : 'white',
          ...rest,
        }}
        onClick={handleParentClick.bind(null, currStruct, null)}>
        {children.map((childStyle, i) => {
          return (
            <div
              style={{
                backgroundColor: selectedChild === i ? 'lightpink' : 'white',
                ...childStyle,
              }}
              onClick={handleChildClick.bind(null, currStruct, i)}>
              <div style={{position: 'absolute'}}>
                {selectedChild != null && children[i][prop[0]]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

const Demo = React.createClass({
  getInitialState() {
    return {
      currStruct: {
        ...defParent,
        children: [defChild, defChild, defChild, defChild, defChild],
      },
      selectedChild: null,
      prop: ['flexDirection', 'row'],
    };
  },

  handleParentClick(altStruct, _, e) {
    e.stopPropagation();
    this.setState({
      currStruct: altStruct,
      prop: ['flexDirection', altStruct.flexDirection],
      selectedChild: null,
    });
  },

  handleChildClick(altStruct, selectedChild, e) {
    e.stopPropagation();
    this.setState({
      currStruct: altStruct,
      prop: ['alignSelf', altStruct.children[selectedChild].alignSelf],
      selectedChild: selectedChild,
    });
  },

  handlePropClick(key) {
    const {selectedChild} = this.state;
    this.setState({
      prop: [key, selectedChild == null ? flexParent[key][0] : flexChild[key][0]],
    });
  },

  render() {
    const {currStruct, selectedChild, prop} = this.state;

    const {children, ...focused} = selectedChild == null ? currStruct : currStruct.children[selectedChild];
    const toChange = selectedChild === null ? flexParent[prop[0]] : flexChild[prop[0]];

    return (
      <div style={{width: '100vw', height: '100vh'}}>
        <div style={{
          width: '100%',
          height: 200,
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#D6E2D6',
        }}>
          <div style={{height: 200}}>
            {Object.keys(focused).map(key => {
              return (
                <div
                  onClick={this.handlePropClick.bind(null, key)}
                  style={{backgroundColor: key === prop[0] ? 'lightpink' : 'white'}}
                  >
                  <span>{key}</span>
                  {': '}
                  <span>
                    {focused[key]}
                  </span>
                </div>
              );
            })}
          </div>

          {construct(currStruct, selectedChild, prop, this.handleParentClick, this.handleChildClick)}
        </div>

        <div style={{transform: 'scale(1)',
          width: '100%',
          display: 'flex',
          // justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {toChange.filter(v => v !== prop[1]).map(v => {
            let altStruct = clone(currStruct);
            if (selectedChild == null) {
              altStruct[prop[0]] = v;
            } else {
              altStruct.children[selectedChild][prop[0]] = v;
            }
            return construct(altStruct, selectedChild, prop, this.handleParentClick, this.handleChildClick);
          })}
        </div>
      </div>
    );
  },
});

export default Demo;
