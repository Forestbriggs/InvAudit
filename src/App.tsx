import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuditPage from './pages/AuditPage';
import AuditHistory from './pages/AuditHistory';
import AuditHistoryDetails from './pages/AuditHistoryDetails';
import AuditDiscrepancies from './pages/AuditDiscrepancies';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen">
                <nav className="bg-base-300 p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="text-2xl font-bold">InvAudit</div>
                        <div className="space-x-4">
                            <Link to="/" className="link no-underline hover:link-primary">Home</Link>
                            <Link to="/audit" className="link no-underline hover:link-primary">Audit in Progress</Link>
                            <Link to="/history" className="link no-underline hover:link-primary">Audit History</Link>
                        </div>
                    </div>
                </nav>
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/audit/:auditId" element={<AuditPage />} />
                        <Route path="/history" element={<AuditHistory />} />
                        <Route path='/audit/:auditId/details' element={<AuditHistoryDetails />} />
                        <Route path='/audit/:auditId/discrepancies' element={<AuditDiscrepancies />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
