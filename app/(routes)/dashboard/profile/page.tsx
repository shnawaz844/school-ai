"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function ProfilePage() {
    const [score, setScore] = useState(0);
    const [studentClass, setStudentClass] = useState('');
    const [subjects, setSubjects] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const resp = await axios.post('/api/users');
            setScore(resp.data?.score || 0);
            setStudentClass(resp.data?.studentClass || '');
            setSubjects(resp.data?.subjects || '');
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
            await axios.post('/api/profile', { studentClass, subjects });
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
            <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-[#FF6600]">
                Student Profile
            </h2>

            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex items-center justify-between relative overflow-hidden group">
                <div className="relative z-10">
                    <label className="block text-gray-700 font-bold mb-1 text-lg">Total Score</label>
                    <p className="text-sm text-gray-500 max-w-[250px]">Your academic score based on session performance and understanding</p>
                </div>
                <div className="text-5xl font-black text-[#FF6600] drop-shadow-sm relative z-10 transform transition-transform group-hover:scale-110 duration-300">{score}</div>
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#FF6600]/5 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="class">
                        Student Class
                    </label>
                    <input
                        id="class"
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        placeholder="e.g. 10th Grade"
                        className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[#FF6600] transition-all text-lg shadow-inner text-gray-800"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="subjects">
                        Subjects
                    </label>
                    <input
                        id="subjects"
                        type="text"
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                        placeholder="e.g. Math, Science, Art"
                        className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[#FF6600] transition-all text-lg shadow-inner text-gray-800"
                    />
                    <p className="mt-2 text-xs text-gray-400 font-medium italic">Separate subjects with commas</p>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#FF6600] text-white py-4 px-6 rounded-xl hover:bg-[#e65c00] transition-all font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#FF6600]/30 transform active:scale-[0.98] mb-2"
            >
                {saving ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Profile...
                    </span>
                ) : 'Update Profile'}
            </button>
        </div>
    );
}

export default ProfilePage;
