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
              : style
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

const Table = ({
  title,
  data,
  loading,
  context,
  header: Header,
  row,
  footer: Footer,
  rowHeight,
  alwaysShowTitle
  // mode
}) => {
  const listRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [modeOfWindowDiv, setModeOfWindowDiv] = useState('original');
  const [listHeight, setListHeight] = useState(
    listRef?.current?.clientHeight || window.innerHeight
  );

  useLayoutEffect(() => {
    const height = listRef?.current?.clientHeight;
    if (height) {
      setListHeight(height);
    }
  }, [listRef, footerRef, Footer]);

  return loading ? (
    <PlaceholderDiv number={Math.floor(listHeight / 64)} height={listHeight} />
  ) : (
    <WindowDiv
      ref={listRef}
      title={title}
      alwaysShowTitle={alwaysShowTitle}
      onExpand={() =>
        console.log(modeOfWindowDiv) || setModeOfWindowDiv('fullScreen')
      }
      onMinimize={() => setModeOfWindowDiv('minimized')}
      onRestore={() => setModeOfWindowDiv('original')}
    >
      <Header {...context} ref={headerRef} />
      <List
        height={listHeight - 200}
        useIsScrolling
        itemCount={data.length}
        itemSize={rowHeight}
        itemData={data}
        width="100%"
        {...context}
      >
        {reactWindowProps => (
          <Row
            component={row}
            {...context}
            {...reactWindowProps}
            mode={modeOfWindowDiv}
          />
        )}
      </List>
      {Footer ? <Footer ref={footerRef} {...context} /> : null}
    </WindowDiv>
  );
};

Table.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  loading: PropTypes.bool,
  context: PropTypes.object,
  rowHeight: PropTypes.number,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]).isRequired,
  row: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  footer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]),
  alwaysShowTitle: PropTypes.bool
};

Table.defaultProps = {
  title: '',
  data: [],
  loading: false,
  context: {},
  rowHeight: 60,
  footer: null,
  alwaysShowTitle: false
};

export default Table;
