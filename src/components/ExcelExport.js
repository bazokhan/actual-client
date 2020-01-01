import React from 'react';
import PropTypes from 'prop-types';
import { FaTable } from 'react-icons/fa';
import ReactExport from 'react-export-excel';
import { n } from 'helpers/mathHelpers';

const { ExcelFile } = ReactExport;
const { ExcelSheet, ExcelColumn } = ExcelFile;

const DownloadButton = () => (
  <button type="button" className="btn btn-action s-square">
    <FaTable />
  </button>
);

const ExcelExport = ({ transactions, activeAccount, activeType }) => {
  if (!transactions || !transactions.length) return null;
  return (
    <ExcelFile element={<DownloadButton />}>
      <ExcelSheet data={transactions} name="Transactions">
        <ExcelColumn label="Date" value="dateString" />
        {!activeAccount && (
          <ExcelColumn label="Account" value={col => col.account.name} />
        )}
        <ExcelColumn
          label="Payee"
          value={col =>
            col.transferAccount.id ? col.transferAccount.name : col.payee.name
          }
        />
        <ExcelColumn label="Notes" value="notes" />
        <ExcelColumn label="Category" value={col => col.categoryObj.name} />
        {(activeType === 'Payment' || activeType === '') && (
          <ExcelColumn
            label="Payments"
            value={col =>
              col.amountType === 'Payment' && col.actualAmount
                ? n(col.actualAmount * -1)
                : null
            }
          />
        )}
        {(activeType === 'Deposit' || activeType === '') && (
          <ExcelColumn
            label="Deposit"
            value={col =>
              col.amountType === 'Deposit' && col.actualAmount
                ? n(col.actualAmount)
                : null
            }
          />
        )}
      </ExcelSheet>
    </ExcelFile>
  );
};

ExcelExport.propTypes = {
  transactions: PropTypes.array.isRequired,
  activeAccount: PropTypes.string.isRequired,
  activeType: PropTypes.string.isRequired
};

export default ExcelExport;
