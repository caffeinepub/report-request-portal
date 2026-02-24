import { RoleProvider } from './contexts/RoleContext';
import Layout from './components/Layout';

function App() {
  return (
    <RoleProvider>
      <Layout />
    </RoleProvider>
  );
}

export default App;
