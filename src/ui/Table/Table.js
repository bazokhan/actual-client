/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List, areEqual } from 'react-window';
import WindowDiv from 'ui/WindowDiv';
import PlaceholderDiv from 'ui/PlaceholderDiv';

const Row = memo(
  ({ data: dataList, index, style, component: RowComponent, ...context }) => {
    const item = dataList[index];
    const isOdd = index % 2;

    return (
      <div key={item.id}>
        <RowComponent
          {...context}
          item={item}
          style={
            isOdd
              ? {
                  ...style,
                  background: 'linear-gradient(transparent, #F8F6F1)'
                }
              : { ...style }
          }
        />
      </div>
    );
  },
  areEqual
);

Row.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  context: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
};

Row.defaultProps = {
  context: {}
};

const Table = ({ data, loading, context, header: Header, row }) => {
  const listRef = useRef(null);
  const [mode, setMode] = useState('original');
  const [listHeight, setListHeight] = useState(window.innerHeight);

  useLayoutEffect(() => {
    const height = listRef?.current?.getClientRects()?.[0]?.height;
    if (height) {
      setListHeight(height);
    }
  }, [listRef, mode]);
  return loading ? (
    <PlaceholderDiv number={Math.floor(listHeight / 64)} height={listHeight} />
  ) : (
    <WindowDiv
      ref={listRef}
      title="Transactions table"
      onExpand={() => setMode('fullScreen')}
      onMinimize={() => setMode('minimized')}
      onRestore={() => setMode('original')}
    >
      <Header {...context} />
      <List
        height={listHeight}
        useIsScrolling
        itemCount={data.length}
        itemSize={60}
        itemData={data}
        width="100%"
      >
        {reactWindowProps => (
          <Row component={row} {...context} {...reactWindowProps} />
        )}
      </List>
    </WindowDiv>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  context: PropTypes.object,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  row: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
};

Table.defaultProps = {
  data: [],
  loading: false,
  context: {}
};

export default Table;
