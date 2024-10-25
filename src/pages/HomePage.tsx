import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [category, setCategory] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', file!);
        formData.append('category', category);

        const response = await fetch('/api/create-audit', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        navigate(`/audit/${data.auditId}`); // Redirect to audit page
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-900 text-white">
            <h1 className="text-3xl">Start New Audit</h1>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full mt-4 p-2 text-black bg-white border border-gray-400 rounded"
            >
                <option disabled value="">Select Category</option>
                <option value="WCS Supplements">Supplements</option>
                <option value="WCS Snacks">Snacks</option>
                <option value="WCS Drinks">Drinks</option>
                <option value="WCS Merchandise">Merch</option>
            </select>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files![0])}
                className="block w-full mt-4"
            />
            <button
                onClick={handleSubmit}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Upload CSV and Start Audit
            </button>
        </div>
    );
};

export default HomePage;