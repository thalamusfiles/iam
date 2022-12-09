import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NotificationProvider from '../../components/Notification';
import AccountRoutes from './routes';

const Account: React.FC<{}> = () => {
  return (
    <>
      <NotificationProvider />

      <Header fixed searchBar />

      <div className="mainContainer topSpace">
        <AccountRoutes />
      </div>

      <Footer />
    </>
  );
};

export default Account;
