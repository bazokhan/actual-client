/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState,
  memo,
  useRef,
  useLayoutEffect,
  useMemo,
  forwardRef
} from 'react';
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

const Table = ({
  title,
  data,
  loading,
  context,
  header: Header,
  row,
  footer: Footer,
  rowHeight
}) => {
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const [mode, setMode] = useState('original');
  const [listHeight, setListHeight] = useState(
    listRef?.current?.clientHeight || window.innerHeight
  );

  useLayoutEffect(() => {
    // const height = listRef?.current?.getClientRects()?.[0]?.height;
    // const footerHeight = footerRef?.current?.getClientRects()?.[0]?.height;
    const height = listRef?.current?.innerHeight;
    const footerHeight = footerRef?.current?.innerHeight;
    // const height = listRef?.current?.offsetHeight;
    // const footerHeight = footerRef?.current?.offsetHeight;
    if (height) {
      console.log(footerHeight, height);
      setListHeight(
        Footer && footerHeight ? height - footerHeight - 60 : height - 60
      );
    }
  }, [mode, listRef, footerRef, Footer]);

  //   const listHeight = useMemo(
  //     () => (listRef?.current?.clientHeight || window.innerHeight) - 200,
  //     [listRef?.current?.clientHeight]
  //   );
  return loading ? (
    <PlaceholderDiv number={Math.floor(listHeight / 64)} height={listHeight} />
  ) : (
    <WindowDiv
      ref={listRef}
      title={title}
      onExpand={() => setMode('fullScreen')}
      onMinimize={() => setMode('minimized')}
      onRestore={() => setMode('original')}
    >
      <Header {...context} />
      <List
        height={console.log(listHeight) || listHeight}
        useIsScrolling
        itemCount={data.length}
        itemSize={rowHeight}
        itemData={data}
        width="100%"
      >
        {reactWindowProps => (
          <Row component={row} {...context} {...reactWindowProps} />
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
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  row: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  footer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ])
};

Table.defaultProps = {
  title: '',
  data: [],
  loading: false,
  context: {},
  rowHeight: 60,
  footer: null
};

export default Table;
