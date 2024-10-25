import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Item {
    id: number;
    name: string;
    upc: string;
    inventory_amount: number;
    actual_amount: number;
}

const AuditPage: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();
    const [items, setItems] = useState<Item[]>([]);
    const [upc, setUPC] = useState('');
    const [missingUPCs, setMissingUPCs] = useState<string[]>([]);
    const [manuallyEntering, setManuallyEntering] = useState(false);
    const [scanInProgress, setScanInProgress] = useState(false); // Track whether a scan is in progress
    const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input

    // Auto-focus the input field when the component renders
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Ensure input stays focused after every render
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });

    useEffect(() => {
        const fetchAuditItems = async () => {
            const response = await fetch(`/api/audit/${auditId}/items`);
            const data = await response.json();
            setItems(data);
        };

        fetchAuditItems();
    }, [auditId]);

    // Effect for auto-submit
    useEffect(() => {
        if (!manuallyEntering && upc.length === 12 && !scanInProgress) {
            submitUPC();
        }
    }, [upc, manuallyEntering]);

    const submitAudit = async () => {
        const response = await fetch(`/api/audit/${auditId}/discrepancies`);
        const discrepancies = await response.json();
        // Display discrepancies or handle them accordingly
        console.log(discrepancies);
        return navigate('/audit/' + auditId + '/discrepancies');
    };

    const submitUPC = async () => {
        if (scanInProgress) return; // Prevent multiple scans at the same time
        setScanInProgress(true); // Lock further scans

        const response = await fetch('/api/update-upc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audit_id: auditId, upc }),
        });

        const data = await response.json();

        if (!data.success) {
            setMissingUPCs([...missingUPCs, upc]);
        } else {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.upc === upc
                        ? { ...item, actual_amount: item.actual_amount + 1 }
                        : item
                )
            );
        }

        setUPC(''); // Clear the input
        setScanInProgress(false); // Unlock scans
    };

    const handleUPCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUPC(e.target.value);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-white">
            <div className='flex justify-between'>
                <h1 className="text-3xl mb-6">Audit in Progress</h1>
                <button onClick={submitAudit} className="bg-green-500 p-2 rounded mb-6">
                    Finish Audit & Show Discrepancies
                </button>
            </div>

            {/* Checkbox for manual entry */}
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={manuallyEntering}
                        onChange={(e) => setManuallyEntering(e.target.checked)}
                        className="mr-2"
                    />
                    Manually Entering
                </label>
            </div>

            {/* UPC Input */}
            <div className="flex items-center space-x-4 mb-6">
                <input
                    ref={inputRef} // Attach the ref to the input
                    type="text"
                    value={upc}
                    onChange={handleUPCChange}
                    placeholder="Scan or Enter UPC"
                    className="block w-full p-2 bg-gray-700 rounded-md"
                    disabled={scanInProgress} // Disable input while a scan is in progress
                />
                {manuallyEntering && (
                    <button onClick={submitUPC} className="bg-blue-500 p-2 rounded" disabled={scanInProgress}>
                        Submit UPC
                    </button>
                )}
            </div>

            {/* Display missing UPCs */}
            {missingUPCs.length > 0 && (
                <div className="overflow-y-auto max-h-96 mb-2">
                    <div className="mt-6">
                        <h2>Missing UPCs:</h2>
                        <ul>
                            {missingUPCs.map((upc, index) => (
                                <li key={`missing-${index}`} className="text-red-500">{upc}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="overflow-y-auto max-h-96">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div key={`item-${item.name}`} className="p-4 bg-gray-800 rounded-md">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-gray-400">UPC: {item.upc}</div>
                            <div className="text-xs text-gray-400">Inventory: {item.inventory_amount}</div>
                            <div className="text-xs text-gray-200">Actual: {item.actual_amount}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AuditPage;