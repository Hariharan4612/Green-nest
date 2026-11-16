import React from 'react';
import AppRouter from './AppRouter.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Toast from './components/Toast.jsx';
import ScreenNavigator from './components/ScreenNavigator.jsx';
import './styles.css';

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toast />
    </AppProvider>
  );
}
