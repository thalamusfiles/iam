import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NotificationProvider from '../../components/Notification';
import MgtRoutes, { findRouteByLocation } from './routes';

function Mgt(props: any) {
  const route = findRouteByLocation(props.location, props.match);

  return (
    <>
      <NotificationProvider />

      <Header fixed title={route?.title} icon={route?.icon} searchBar />

      <div className="mainContainer topSpace">
        <MgtRoutes />
      </div>

      <Footer />
    </>
  );
}

export default Mgt;
