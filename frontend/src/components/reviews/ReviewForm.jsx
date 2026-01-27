import React, { useState } from 'react';
import { Star, Camera, X, Loader2, Sparkles } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

const ReviewForm = ({ onSubmit, loading }) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsCompressing(true);
            try {
                // Compress to 150KB as requested
                const compressed = await compressImage(file, 150);
                setImage(compressed);
                setImagePreview(URL.createObjectURL(compressed));
            } catch (err) {
                console.error("Compression failed:", err);
                alert("Failed to process image. Please try another.");
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return alert("Please leave a comment.");
        onSubmit({ rating, comment, image });
        // Reset after submit
        setComment('');
        setImage(null);
        setImagePreview(null);
        setRating(5);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-premium space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                    <Sparkles size={16} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900">Share Your Experience</h3>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Divine Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform active:scale-90"
                        >
                            <Star
                                size={28}
                                className={`${(hover || rating) >= star ? "fill-royal-gold text-royal-gold scale-110" : "text-gray-200"} transition-all duration-300`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Thoughts</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the craftsmanship and beauty of this piece..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none min-h-[120px] font-medium text-gray-700"
                    required
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95">
                        <Camera size={18} />
                        {isCompressing ? 'Processing...' : 'Add Photo'}
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={isCompressing || loading} />
                    </label>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Max 150KB (Auto-compressed)</span>
                </div>

                {imagePreview && (
                    <div className="relative inline-block group">
                        <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-2xl border-4 border-white shadow-xl" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading || isCompressing}
                className="w-full py-5 bg-royal-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-premium active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <>
                        Submit Divine Review
                        <Sparkles size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
