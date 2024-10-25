import React, { useEffect, useState } from 'react';

const AuditHistory: React.FC = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const response = await fetch('/api/history');
            const data = await response.json();
            setHistory(data);
        };

        fetchHistory();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-gray-800 text-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">Audit History</h1>
            {history.length === 0 ? (
                <p className="text-center text-gray-500">No audit history available.</p>
            ) : (
                <ul className="space-y-4">
                    {history.map((audit: any) => (
                        <li key={audit.id} className="p-4 border border-gray-600 rounded-md bg-gray-700">
                            <div className="text-lg font-medium">Category: {audit.category}</div>
                            <div className="text-gray-400">Date: {audit.date_performed}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AuditHistory;