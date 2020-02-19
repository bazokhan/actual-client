import React, { useState, useContext } from 'react';
import { DataContext } from 'App/context';
import TransactionsHeader from './components/TransactionHeader';
import Transaction from './components/Transaction';
import TransactionFooter from './components/TransactionFooter';
import Header from './components/Header';
import styles from './Home.module.scss';

const Home = () => {
  const { activeAccount, activeType, activeTransactions, sortBy } = useContext(
    DataContext
  );
  const [isAscending, setIsAscending] = useState(false);
  return (
    // <div className={styles.container}>
    //   {/* <button type="button" onClick={reset}>
    //     Reset all filters
    //   </button> */}
    //   {optionsState.sidebar && (
    //     <Sidebar filters={filterValues} filterBy={filterBy} />
    //   )}
    //   <div className={styles.main}>
    //     <div className={styles.header}>
    //       <Header
    //         filters={filterValues}
    //         transactions={filteredTransactions}
    //         setModalOpen={setModalOpen}
    //         optionsState={optionsState}
    //         setOptionsState={setOptionsState}
    //       />
    //     </div>
    //     <div className={styles.body}>
    //       {modalOpen && (
    //         <TransactionInput
    //           filters={filterValues}
    //           onClose={() => setModalOpen(false)}
    //         />
    //       )}
    //       {loading ? (
    //         <PlaceholderDiv
    //           number={Math.floor(listHeight / 64)}
    //           height={listHeight}
    //         />
    //       ) : (
    //         <WindowDiv
    //           ref={listRef}
    //           title="Transactions table"
    //           onExpand={() => setMode('fullScreen')}
    //           onMinimize={() => setMode('minimized')}
    //           onRestore={() => setMode('original')}
    //         >
    //           <TransactionsHeader filters={filterValues} sortBy={sortBy} />
    //           <List
    //             height={listHeight}
    //             useIsScrolling
    //             itemCount={filteredTransactions.length}
    //             itemSize={60}
    //             itemData={filteredTransactions}
    //             width="100%"
    //           >
    //             {Row}
    //           </List>
    //         </WindowDiv>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <>
      <div className={styles.header}>
        <Header />
        <TransactionsHeader
          activeAccount={activeAccount}
          sortBy={sortBy}
          isAscending={isAscending}
          toggleSortMode={() => setIsAscending(!isAscending)}
          activeType={activeType}
        />
      </div>
      <div className={styles.body}>
        {activeTransactions.map(transaction => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            activeAccount={activeAccount}
            activeType={activeType}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <TransactionFooter
          activeAccount={activeAccount}
          activeTransactions={activeTransactions}
          activeType={activeType}
        />
      </div>
    </>
  );
};

export default Home;
