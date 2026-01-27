import React, { useState, useEffect } from 'react';
import { Star, Camera, X, Loader2, Sparkles, Send } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

const ReviewForm = ({ onSubmit, loading, initialData, submitLabel = "Submit Review" }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [compressionLoading, setCompressionLoading] = useState(false);

    // Pre-fill form if editing
    useEffect(() => {
        if (initialData) {
            setRating(initialData.rating || 0);
            setComment(initialData.comment || '');
            if (initialData.image) {
                setPreview(initialData.image);
                // Don't set 'image' state unless file changes, to avoid re-uploading URL
            }
        }
    }, [initialData]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCompressionLoading(true);
            try {
                // Compress to 150KB as requested
                const compressed = await compressImage(file, 150);
                setImage(compressed);
                setPreview(URL.createObjectURL(compressed));
            } catch (err) {
                console.error("Compression failed:", err);
                alert("Failed to process image. Please try another.");
            } finally {
                setCompressionLoading(false);
            }
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return alert("Please leave a comment.");

        // Pass 'image' (file) if changed, otherwise valid only if not editing or if we want to update text only
        onSubmit({ rating, comment, image });

        // Only clear if NOT editing
        if (!initialData) {
            setComment('');
            setImage(null);
            setPreview(null);
            setRating(0);
        }
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
                        {compressionLoading ? 'Processing...' : 'Add Photo'}
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" disabled={compressionLoading || loading} />
                    </label>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Max 150KB (Auto-compressed)</span>
                </div>

                {preview && (
                    <div className="relative inline-block group">
                        <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-2xl border-4 border-white shadow-xl" />
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
                disabled={loading || compressionLoading || rating === 0}
                className="w-full bg-royal-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-royal-red transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading || compressionLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        {compressionLoading ? 'Compressing...' : 'Submitting...'}
                    </>
                ) : (
                    <>
                        <Send size={16} />
                        {submitLabel}
                    </>
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
