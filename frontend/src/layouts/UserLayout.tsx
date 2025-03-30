
import { ReactNode } from 'react';
import Navbar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';

interface UserLayoutProps {
  children: ReactNode;
}


const UserLayout = ({children} : UserLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-1 min-h-[500px] mt-[80px] overflow-y-auto ">
          {children}
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;


