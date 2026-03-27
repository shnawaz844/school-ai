"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function ProfilePage() {
    const [score, setScore] = useState(0);
    const [classSubject, setClassSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const resp = await axios.post('/api/users');
            setScore(resp.data?.score || 0);
            setClassSubject(resp.data?.classSubject || '');
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/profile', { classSubject });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-500 font-semibold animate-pulse">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 mt-10 transition-all hover:shadow-xl">
            <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Student Profile
            </h2>
            
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex items-center justify-between">
                <div>
                    <label className="block text-gray-700 font-bold mb-1 text-lg">Total Score</label>
                    <p className="text-sm text-gray-500">Keep learning to increase your score!</p>
                </div>
                <div className="text-5xl font-black text-blue-600 drop-shadow-sm">{score}</div>
            </div>

            <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="subject">
                    Class Subject
                </label>
                <input 
                    id="subject"
                    type="text" 
                    value={classSubject}
                    onChange={(e) => setClassSubject(e.target.value)}
                    placeholder="e.g. Mathematics, Science"
                    className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg shadow-inner text-gray-800"
                />
            </div>

            <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-[0.98]"
            >
                {saving ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                    </span>
                ) : 'Save Changes'}
            </button>
        </div>
    );
}

export default ProfilePage;
