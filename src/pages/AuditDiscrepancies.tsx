import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Item {
    id: number;
    name: string;
    upc: string;
    inventory_amount: number;
    actual_amount: number;
    difference: number;
}

const AuditDiscrepancies: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const [discrepancies, setDiscrepancies] = useState<Item[]>([]);

    useEffect(() => {
        const fetchDiscrepancies = async () => {
            const response = await fetch(`/api/audit/${auditId}/discrepancies`);
            const data = await response.json();
            setDiscrepancies(data);
        };

        fetchDiscrepancies();
    }, [auditId]);

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-900 text-white" >
            <h1 className="text-3xl mb-6" > Audit Discrepancies </h1>
            <ul className="space-y-4" >
                {
                    discrepancies.map((item: Item) => (
                        <li key={`item-${item.name}`} className="p-4 bg-gray-800 rounded-md" >
                            <div className="text-lg font-semibold" > {item.name} </div>
                            < div className="text-sm text-gray-400" > UPC: {item.upc} </div>
                            < div className="text-sm text-gray-400" >
                                Inventory: {item.inventory_amount}
                            </div>
                            < div className="text-sm text-gray-200" >
                                Actual: {item.actual_amount}
                            </div>
                            < div className="text-sm font-bold" >
                                Difference: {item.difference > 0 ? '+' : ''}
                                {item.difference}
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default AuditDiscrepancies;