import React, { useState, useMemo } from 'react';
import cx from 'classnames';
import styles from './Order.module.scss';

const tests = [
  {
    label: 'سونار بطن وحوض',
    value: '001',
    price: 150
  },
  {
    label: 'دوبلر شرايين طرف واحد',
    value: '002',
    price: 230
  },
  {
    label: 'أشعة عادية على الفخذ',
    value: '003',
    price: 110
  }
];
const Order = () => {
  const [deduction, setDeduction] = useState(0);
  const [price, setPrice] = useState(0);
  const finalPrice = useMemo(() => price - (price * deduction) / 100, [
    price,
    deduction
  ]);
  return (
    <div className={styles.container}>
      <div className={cx(styles.form, 'form-group')}>
        <h3>أمر تشغيل خدمة</h3>
        <label htmlFor="patient-name" className="form-label from-sm">
          <p>اسم المريض</p>
          <input
            id="patient-name"
            type="text"
            className="form-input input-sm"
            placeholder="Enter patient name"
          />
        </label>
        <label htmlFor="patient-age" className="form-label from-sm">
          <p>السن</p>
          <input
            id="patient-age"
            type="number"
            className="form-input input-sm"
            placeholder="Enter patient age"
          />
        </label>
        <label htmlFor="patient-weight" className="form-label from-sm">
          <p>الوزن</p>
          <input
            id="patient-weight"
            type="number"
            className="form-input input-sm"
            placeholder="Enter patient weight"
          />
        </label>

        <label htmlFor="tests" className="form-label from-sm">
          <p>الفحص</p>
          <select
            id="tests"
            type="number"
            className="form-input input-sm"
            placeholder="Enter patient weight"
            onChange={e =>
              setPrice(
                tests.find(test => test.value === e.target.value).price || 0
              )
            }
          >
            {tests.map(test => (
              <option key={test.value} value={test.value}>
                {test.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="deduction" className="form-label from-sm">
          <p>خصم</p>
          <input
            id="deduction"
            type="number"
            className="form-input input-sm"
            placeholder="Enter patient weight"
            onChange={e => setDeduction(Number(e.target.value))}
          />
        </label>

        <div className={styles.totalPrice}>
          <p>السعر قبل الخصم</p>
          <p>{price} LE</p>
          <p>نسبة الخصم</p>
          <p>{deduction} %</p>
          <p>قيمة الخصم</p>
          <p>{(price * deduction) / 100} LE</p>
          <p>السعر النهائي</p>
          <p>{finalPrice} LE</p>
        </div>
      </div>
    </div>
  );
};

export default Order;
