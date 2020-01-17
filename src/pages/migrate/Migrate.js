import React, { useState } from 'react';
import styles from './Migrate.module.scss';
import Pagination from './components/Pagination';
import useMigrationSteps from './hooks/useMigrationSteps';

const Migrate = () => {
  const { loading, steps } = useMigrationSteps();
  const [activeIndex, setActiveIndex] = useState(0);

  if (loading) {
    return <div className={styles.loading}>Loading ...</div>;
  }

  return (
    <div className={styles.migrateContainer}>
      <div className="toast toast-warning">
        Warning! Do not use this section unless you know what you are doing!
      </div>
      {steps.map(
        step =>
          activeIndex === step.index && (
            <div key={step.index} className={styles.step}>
              <p className={styles.title}>
                {step.index + 1}. {step.label}
              </p>
              {!step.prevSuccess && (
                <div className="toast toast-primary">
                  Complete previous steps first.
                </div>
              )}
              <p>
                Migrated {step.newRecords} of {step.oldRecords} {step.name}.
              </p>
              <button
                className={`btn btn-primary btn-lg ${
                  step.loading ? ' loading' : ''
                }`}
                type="button"
                disabled={step.loading || step.success || !step.prevSuccess}
                onClick={step.onClick}
              >
                {step.success ? 'Success!' : 'Migrate'}
              </button>
            </div>
          )
      )}
      <Pagination
        steps={steps}
        setActiveIndex={setActiveIndex}
        activeIndex={activeIndex}
      />
    </div>
  );
};

export default Migrate;
