import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NotificationMenu from '../../components/Notification';
import MgtRoutes from './routes';

const Mgt: React.FC = () => {
  // TODO: Ajustar
  //const route = findRouteByLocation(props.location, props.match);
  //icon={route?.icon}
  return (
    <>
      <NotificationMenu />

      <Header fixed title={'route?.title'} searchBar />

      <div className="mainContainer topSpace">
        <MgtRoutes />
      </div>

      <Footer />
    </>
  );
};

export default Mgt;
