/* eslint-disable no-nested-ternary */
import { useMemo, createContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import servicesGql from '../gql/sercvices.gql';

const ServiceContext = createContext({
  activeService: null,
  setService: () => {},
  author: null
});

const useServicesContext = client => {
  const { data, loading, error } = useQuery(servicesGql, {
    fetchPolicy: 'network-only',
    client
  });

  const myService = useMemo(() => data?.myService, [data]);
  const sharedServices = useMemo(() => data?.contributorServices, [data]);
  const author = useMemo(() => data?.myProfile, [data]);
  const ServiceProvider = useMemo(() => ServiceContext.Provider, []);

  const initialActiveService = useMemo(() => {
    try {
      const serviceId = localStorage.getItem('active_service');
      console.log(serviceId);
      return myService?.id === serviceId
        ? myService
        : sharedServices?.map(s => s.id).includes(serviceId)
        ? sharedServices.find(s => s.id === serviceId)
        : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }, [myService, sharedServices]);

  const [activeService, setActiveService] = useState(initialActiveService);
  const setService = service => {
    try {
      localStorage.setItem('active_service', service.id);
      setActiveService(service);
    } catch (err) {
      console.log(err);
    }
  };

  const isOwnService = useMemo(
    () => activeService?.id === author?.service?.id,
    [activeService, author]
  );

  useEffect(() => {
    if (initialActiveService) {
      setService(initialActiveService);
    } else if (myService && !initialActiveService && !loading) {
      setService(myService);
    }
  }, [myService, initialActiveService, loading]);

  return {
    Service: {
      activeService,
      myService,
      sharedServices,
      loading,
      error,
      setService,
      author,
      isOwnService
    },
    ServiceProvider
  };
};

export { ServiceContext };

export default useServicesContext;
