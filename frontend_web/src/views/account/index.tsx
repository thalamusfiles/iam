import React from 'react';
import Footer from '../../components/Footer';
import NotificationMenu from '../../components/Notification';
import HeaderAccount from './header';
import AccountRoutes from './routes';

const Account: React.FC = () => {
  return (
    <>
      <NotificationMenu />

      <HeaderAccount />

      <div className="mainContainer topSpace">
        <AccountRoutes />
      </div>

      <Footer />
    </>
  );
};

export default Account;
