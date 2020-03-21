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
// import { createContext } from 'react';

// const TableContext = createContext(null);
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
    // const height = listRef?.current?.getClientRects()?.[0]?.height;
    // const footerHeight = footerRef?.current?.getClientRects()?.[0]?.height;
    const height = listRef?.current?.clientHeight;
    const headerHeight = headerRef?.current?.clientHeight;
    const footerHeight = footerRef?.current?.clientHeight;
    // const height = listRef?.current?.getComputedStyle(divElement).height;
    // const footerHeight = footerRef?.current?.getComputedStyle(divElement).height;
    if (height) {
      let netHeight = height;
      // if (headerHeight) netHeight -= headerHeight;
      // if (footerHeight) netHeight -= footerHeight;
      setListHeight(netHeight);
    }
  }, [listRef, footerRef, Footer]);

  //   const listHeight = useMemo(
  //     () => (listRef?.current?.clientHeight || window.getComputedStyle(divElement).height) - 200,
  //     [listRef?.current?.clientHeight]
  //   );
  return loading ? (
    <PlaceholderDiv number={Math.floor(listHeight / 64)} height={listHeight} />
  ) : (
    // <TableContext.Provider>
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
    // </TableContext.Provider>
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
