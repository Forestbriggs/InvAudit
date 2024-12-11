import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const AuditHistory: React.FC = () => {
    const [history, setHistory] = useState([]);
    const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);

    const fetchHistory = async () => {
        const response = await fetch('/api/history');
        const data = await response.json();
        setHistory(data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const requestConfirmation = (auditId: number) => {
        const confirmationModal = document.getElementById('confirmation_modal');

        if (confirmationModal) {
            setSelectedAuditId(auditId);
            confirmationModal.showModal();
        }
    }

    const deleteAudit = async () => {
        const response = await fetch(`/api/audit/${selectedAuditId}`, {
            method: 'DELETE'
        });

        const data = response.json();
        console.log(data);

        fetchHistory();
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-base-300 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">Audit History</h1>
            {history.length === 0 ? (
                <p className="text-center text-gray-500">No audit history available.</p>
            ) : (
                <ul className="space-y-4">
                    {history.map((audit: any) => (
                        <li key={audit.id} className="p-4 border border-gray-500 rounded-md bg-gray-700 flex justify-between items-center">
                            <div>
                                <div className="text-lg font-medium">Category: {audit.category}</div>
                                <div className="text-gray-400">Date: {format(audit.date_performed, "MMMM d, yyyy")}</div>
                            </div>
                            <div className='flex gap-4'>
                                <Link to={`/audit/${audit.id}/details`} className='btn btn-secondary'>View Details</Link>
                                <Link to={`/audit/${audit.id}/discrepancies`} className='btn btn-primary' >View Discrepancies</Link>
                                <button className='btn btn-error' onClick={() => requestConfirmation(audit.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <dialog id="confirmation_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you finished with your audit?</h3>
                    <p className="py-4 text-sm text-gray-400 w-3/4">Confirming will lock you out of your audit, make sure you are finished before submitting.</p>
                    <div className="modal-action">
                        <button
                            className='btn btn-success'
                            onClick={() => {
                                deleteAudit();
                                document.getElementById('confirmation_modal')!.close()
                            }}
                        >
                            Yes, Delete
                        </button>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-error">Cancel</button>
                        </form>
                    </div>
                </div>
            </dialog >
        </div>
    );
};

export default AuditHistory;