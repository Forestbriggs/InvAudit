import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [category, setCategory] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (file === null) {

            return;
        } else if (category === '') {
            return;
        }

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
        <div className="max-w-lg mx-auto p-4 bg-base-300 rounded-xl flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-semibold">Start New Audit</h1>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full max-w-xs"
            >
                <option disabled value="">Select Category</option>
                <option value="WCS Supplements">Supplements</option>
                <option value="WCS Snacks">Snacks</option>
                <option value="WCS Drinks">Drinks</option>
                <option value="WCS Merchandise">Merch</option>
            </select>
            <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => setFile(e.target.files![0])}
            />
            <button
                onClick={handleSubmit}
                className="btn btn-primary"
            >
                Upload CSV and Start Audit
            </button>
        </div>
    );
};

export default HomePage;