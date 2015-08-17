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

  height: [30],
  width: [50],
  outline: ['1px solid'],
};

const flexChild = {
  // order: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  flexGrow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  flexShrink: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
  flexBasis: ['auto', 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],

  alignSelf: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],

  height: [30],
  width: [50],
  outline: ['1px solid'],
};

const defParent = mapObj(flexParent, val => val[0]);
const defChild = mapObj(flexChild, val => val[0]);

function construct(currStruct, prop, selectedChild, handleParentClick, handleChildClick) {
  const {children, ...rest} = currStruct;
  const [name, val] = prop;
  let propParent;
  let propChild;
  if (selectedChild == null) {
    propParent = prop;
    propChild = ['alignSelf', 'flex-start'];
  } else {
    propParent = ['flexDirection', 'row'];
    propChild = prop;
  }
  return (
    <div style={rest} onClick={handleParentClick.bind(null, currStruct, null, propParent)}>
      <pre style={{}}>{JSON.stringify(rest, null, 2)}</pre>
      {children.map((childStyle, i) => {
        return (
          <div
            style={childStyle}
            onClick={handleChildClick.bind(null, currStruct, i, propChild)}>
          </div>
        );
      })}
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
        height: 200,
        width: 400,
        children: [defChild, defChild, defChild],
      },
      selectedChild: null,
      prop: ['flexDirection', 'row'],
    };
  },

  handleParentClick(altStruct, selectedChild, altProp, e) {
    e.stopPropagation();
    this.setState({
      currStruct: altStruct,
      prop: ['flexDirection', altStruct.flexDirection],
      selectedChild: selectedChild,
    });
  },

  handleChildClick(altStruct, selectedChild, altProp, e) {
    e.stopPropagation();
    this.setState({
      currStruct: altStruct,
      prop: ['alignSelf', altStruct.children[selectedChild].alignSelf],
      selectedChild: selectedChild,
    });
  },

  render() {
    const {currStruct, selectedChild, prop} = this.state;

    const {children, ...focused} = selectedChild == null ? currStruct : currStruct.children[selectedChild];
    const toChange = selectedChild === null ? flexParent[prop[0]] : flexChild[prop[0]];

    return (
      <div style={{width: '100vw', height: '100vh'}}>
        <pre style={{height: 175}}>{JSON.stringify(focused, null, 2)}</pre>
        <div style={{width: '100%', height: 300, display: 'flex', justifyContent: 'center', outline: '4px solid blue'}}>
          {construct(currStruct, prop, selectedChild, this.handleParentClick, this.handleChildClick)}
        </div>

        <div style={{transform: 'scale(1)', width: '100%', height: 300, display: 'flex', justifyContent: 'center', outline: '1px solid red'}}>
          {toChange.filter(v => v !== prop[1]).map(v => {
            let altStruct = clone(currStruct);
            if (selectedChild == null) {
              altStruct[prop[0]] = v;
            } else {
              altStruct.children[selectedChild][prop[0]] = v;
            }
            return construct(altStruct, [prop[0], v], selectedChild, this.handleParentClick, this.handleChildClick);
          })}
        </div>
      </div>
    );
  },
});

export default Demo;
