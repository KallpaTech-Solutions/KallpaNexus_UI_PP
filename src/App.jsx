import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainShell from './layouts/MainShell';
import Home from './pages/Home';
import NexusSport from './pages/NexusSport';
import NexusStay from './pages/NexusStay';
import NexusCare from './pages/NexusCare';
import NexusGear from './pages/NexusGear';
import Dashboard from './pages/Dashboard';
import AccesoReservadoLanding from './pages/AccesoReservadoLanding';
import PageVisitTracker from './components/PageVisitTracker';

function App() {
  return (
    <Router>
      <PageVisitTracker />
      <Routes>
        <Route path="/acceso-reservado" element={<AccesoReservadoLanding />} />
        <Route element={<MainShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/nexussport" element={<NexusSport />} />
          <Route path="/nexusstay" element={<NexusStay />} />
          <Route path="/nexuscare" element={<NexusCare />} />
          <Route path="/nexusgear" element={<NexusGear />} />
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
