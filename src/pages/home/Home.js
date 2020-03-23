import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import ItemCard from 'ui/ItemCard/ItemCard';
import sercvicesGql from './gql/sercvices.gql';
import styles from './Home.module.scss';

const ServiceCard = ({ service, title, loading }) => {
  return (
    <ItemCard title={title} style={{ margin: '10px' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          Owned By: <span>{service?.owner?.name}</span>
        </p>
      )}
    </ItemCard>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

const Home = () => {
  const { data, loading, error } = useQuery(sercvicesGql, {
    fetchPolicy: 'network-only'
  });
  const myService = useMemo(() => data?.myService, [data]);
  const sharedServices = useMemo(() => data?.contributorServices, [data]);

  if (error) return <div className={styles.loading}>Error!</div>;

  return (
    <div className={styles.container}>
      <ServiceCard title="Me" service={myService} loading={loading} />
      {sharedServices?.map(service => (
        <ServiceCard
          key={service?.id}
          title="Shared"
          service={service}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default Home;
