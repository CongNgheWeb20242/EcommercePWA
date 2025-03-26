import './App.css';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Button } from './components/ui/button';
import { User } from "lucide-react";
// import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {/* shadCN UI + lucide-react */}
      <User></User>
      <Button>Click me</Button>
      <h1>Zustand API Fetch Demo</h1>
      {user ? (
        <>
          <h3>Name: {user.name}</h3>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>No user data</p>
      )}
    </div>
  );
};

export default App;
