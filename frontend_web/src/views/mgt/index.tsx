import React from 'react';
import Footer from '../../components/Footer';
import NotificationMenu from '../../components/Notification';
import Header from './header';
import MgtRoutes, { MgtModalRoutes } from './routes';

const Mgt: React.FC = () => {
  return (
    <>
      <NotificationMenu />

      <Header />

      <MgtModalRoutes />
      <div className="mainContainer topSpace">
        <MgtRoutes />
      </div>

      <Footer />
    </>
  );
};

export default Mgt;
