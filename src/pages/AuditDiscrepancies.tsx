import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Item {
    id: number;
    name: string;
    upc: string;
    inventory_amount: number;
    actual_amount: number;
}

const AuditHistoryDetails: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchAuditDetails = async () => {
            const response = await fetch(`/api/audit/${auditId}/items`);
            const data = await response.json();
            setItems(data);
        };

        fetchAuditDetails();
    }, [auditId]);

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-white">
            <h1 className="text-3xl mb-6">Audit Details (Read-Only)</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-800 rounded-md">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">UPC: {item.upc}</div>
                        <div className="text-xs text-gray-400">Inventory: {item.inventory_amount}</div>
                        <div className="text-xs text-gray-200">Actual: {item.actual_amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditHistoryDetails;
