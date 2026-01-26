import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            await dispatch(forgotPassword(identifier)).unwrap();
            setStep(2);
            setMessage('OTP sent! Check your email.');
        } catch (err) {
            // error handled by redux state
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await dispatch(resetPassword({ identifier, otp, newPassword })).unwrap();
            setStep(3);
        } catch (err) {
            // error handled by redux state
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                        <KeyRound size={32} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify & Reset' : 'Success!'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {step === 1 && "Enter your email or username to receive an OTP."}
                    {step === 2 && "Enter the OTP sent to your email and your new password."}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {message && step !== 3 && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                            {message}
                        </div>
                    )}

                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                                    Email or Username
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        id="identifier"
                                        name="identifier"
                                        type="text"
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleReset}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">One-Time Password (OTP)</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-center tracking-[0.5em] font-mono text-lg"
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        placeholder="Min 6 characters"
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        placeholder="Confirm new password"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <div className="text-center">
                                <button type="button" onClick={() => setStep(1)} className="text-sm text-red-600 hover:text-red-500">
                                    Resend OTP / Change Email
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Password Reset Successful!</h3>
                            <p className="mt-2 text-sm text-gray-500 mb-8">
                                Your password has been successfully updated. You can now log in with your new credentials.
                            </p>
                            <Link
                                to="/login"
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                            >
                                Please Login <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>

                {step !== 3 && (
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                            Back to sign in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
