import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ToastErrors = {
    fileError: string
    categoryError: string
}

const HomePage: React.FC = () => {
    const [category, setCategory] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [toast, setToast] = useState<ToastErrors>({ fileError: '', categoryError: '' });
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const newToastErrors: ToastErrors = {
            fileError: '',
            categoryError: ''
        };
        if (file === null) {
            newToastErrors['fileError'] = 'No file found...';
        }
        if (category.length === 0) {
            newToastErrors['categoryError'] = 'Category is required.';
        }

        if (newToastErrors.fileError.length > 0 ||
            newToastErrors.categoryError.length > 0
        ) {
            setToast(newToastErrors);
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

    const handleCategory = (e: ChangeEvent) => {
        if (toast.categoryError.length > 0) {
            setToast({
                fileError: toast.fileError,
                categoryError: ''
            });
        }

        setCategory(e.target!.value);
    }

    const handleFile = (e: ChangeEvent) => {
        if (toast.fileError.length > 0) {
            setToast({
                fileError: '',
                categoryError: toast.categoryError
            });
        }

        setFile(e.target!.files![0]);
    }

    return (
        <>
            <div className="max-w-lg mx-auto p-4 bg-base-300 rounded-xl flex flex-col justify-center items-center gap-4">
                <h1 className="text-3xl font-semibold">Start New Audit</h1>
                <select
                    value={category}
                    onChange={(e) => handleCategory(e)}
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
                    onChange={(e) => handleFile(e)}
                />
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                >
                    Upload CSV and Start Audit
                </button>
            </div>
            <div className="toast toast-end">
                {Object.values(toast).length > 0 &&
                    <>
                        {Object.values(toast).map(toastText => {
                            if (toastText.length > 0) {

                                return (
                                    <div key={toastText} className="alert alert-error">
                                        <span>{toastText}</span>
                                    </div>
                                )
                            }

                        })}
                    </>
                }
            </div>
        </>
    );
};

export default HomePage;