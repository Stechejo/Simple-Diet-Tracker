import { NavLink } from 'react-router-dom';

export default function Tabs({ t }) {
  return (
    <div className="tabs">
      <NavLink to="/" end className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        {t.tabOverview}
      </NavLink>
      <NavLink to="/perioden" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        {t.tabPeriods}
      </NavLink>
    </div>
  );
}
