import React, { useMemo, useContext } from 'react';
import { ServiceContext } from 'App/hooks/useServicesContext';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import ItemCard from 'ui/ItemCard/ItemCard';
import sercvicesGql from './gql/sercvices.gql';
import styles from './Home.module.scss';

const ServiceCard = ({ service, title, loading, active, onClick }) => {
  return (
    <ItemCard
      title={title}
      style={{
        margin: '10px',
        border: active ? 'solid 2px #A2CAE3' : 'none'
      }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>
            Owned By: <span>{service?.owner?.name}</span>
          </p>
          <p>{service?.id?.slice(0, 8)}</p>
          {service?.contributors?.length > 0 && (
            <>
              <p>Contributors:</p>
              {service?.contributors?.map(contributor => (
                <p key={contributor?.id}>{contributor?.name}</p>
              ))}
            </>
          )}
          <button
            type="button"
            onClick={onClick}
            disabled={active}
            className={styles.loginButton}
            style={{
              color: active ? '#ddd' : 'blue',
              cursor: active ? 'not-allowed' : 'pointer'
            }}
          >
            {active ? 'Active' : 'Log into this service'}
          </button>
        </>
      )}
    </ItemCard>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const Home = () => {
  const { activeService, setService } = useContext(ServiceContext);
  const { data, loading, error } = useQuery(sercvicesGql, {
    fetchPolicy: 'network-only'
  });
  const myService = useMemo(() => data?.myService, [data]);
  const sharedServices = useMemo(() => data?.contributorServices, [data]);

  if (error) return <div className={styles.loading}>Error!</div>;

  return (
    <div className={styles.container}>
      <ServiceCard
        title="Me"
        service={myService}
        loading={loading}
        active={activeService?.id === myService?.id}
        onClick={() => setService(myService)}
      />
      {sharedServices?.map(s => (
        <ServiceCard
          key={s?.id}
          title="Shared"
          service={s}
          loading={loading}
          active={activeService?.id === s?.id}
          onClick={() => setService(s)}
        />
      ))}
    </div>
  );
};

export default Home;
