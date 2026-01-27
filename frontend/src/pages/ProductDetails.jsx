import ReviewForm from '../components/reviews/ReviewForm';
import { addReview } from '../redux/slices/productSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { productDetails: product, loading, error, reviewLoading } = useSelector((state) => state.products);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const images = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);

    useEffect(() => {
        if (!images.length || images.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length, isHovered]);

    const { user } = useSelector(state => state.auth);
    const userProfile = useSelector(state => state.user.profile);
    const currentUser = userProfile || user;

    useEffect(() => {
        if (id && id !== 'undefined') {
            dispatch(fetchProductDetails(id));
            dispatch(logAnalyticsEvent({
                eventType: 'VIEW_PRODUCT',
                productId: id
            }));
        }
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    if (!id || id === 'undefined') {
        return (
            <div className="min-h-screen bg-gift-cream">
                <Navbar />
                <div className="pt-32 text-center space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Treasure Not Found</h2>
                    <Link to="/" className="text-royal-red font-bold underline decoration-2 underline-offset-8">Return to Collection</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gift-cream flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-red"></div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Unveiling Masterpiece...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gift-cream">
                <Navbar />
                <div className="pt-32 text-center text-royal-red p-8">
                    <h2 className="text-2xl font-serif font-bold">Divine Connection Interrupted</h2>
                    <p className="text-gray-500 mt-2">{error}</p>
                    <Link to="/" className="text-gray-900 mt-6 inline-block font-bold underline">Back to Collection</Link>
                </div>
            </div>
        );
    }

    const isLiked = currentUser?.likedProducts?.includes(product._id);
    // Images declaration moved up for auto-scroll logic

    const handleWishlist = () => {
        if (!currentUser) return alert("Please login first");

        if (!isLiked) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#991B1B', '#D97706', '#FFFFFF'],
                disableForReducedMotion: true
            });
        }

        dispatch(toggleWishlistProduct(product._id));
    };

    const handleReviewSubmit = async (reviewData) => {
        const formData = new FormData();
        formData.append('rating', reviewData.rating);
        formData.append('comment', reviewData.comment);
        if (reviewData.image) {
            formData.append('image', reviewData.image);
        }

        try {
            await dispatch(addReview({ productId: product._id, reviewData: formData })).unwrap();
            alert("Review submitted successfully!");
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="min-h-screen bg-gift-cream selection:bg-royal-red/30">
            <Navbar />

            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link to="/" className="group inline-flex items-center gap-3 text-gray-400 hover:text-royal-black mb-12 transition-colors font-bold text-xs uppercase tracking-widest">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Collection
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Image Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            layoutId={`product-image-${product._id}`}
                            className="aspect-[4/5] rounded-3xl md:rounded-[3rem] overflow-hidden bg-white relative border border-gray-100/50 shadow-premium group"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-contain p-6 md:p-12"
                                />
                            </AnimatePresence>

                            {/* Floating Badges */}
                            <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-2 md:gap-3">
                                {product.isNew && (
                                    <span className="px-3 py-1.5 md:px-5 md:py-2 bg-royal-red text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-2xl">
                                        Rare Piece
                                    </span>
                                )}
                                <span className="px-3 py-1.5 md:px-5 md:py-2 glass-card text-royal-gold text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full">
                                    Handcrafted
                                </span>
                                {product.tags && product.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 md:px-5 md:py-2 bg-royal-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full shadow-2xl opacity-90">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        onClick={() => { setSelectedImage(idx); setIsHovered(true); }} // Pause on manual selection
                                        className={`aspect-square rounded-2xl overflow-hidden bg-white cursor-pointer border-2 transition-all p-2 ${idx === selectedImage ? 'border-royal-red shadow-lg' : 'border-gray-100 hover:border-royal-gold'}`}
                                    >
                                        <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-royal-gold font-black tracking-widest text-[10px] uppercase">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < (product.rating || 0) ? "fill-royal-gold" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <span>{product.reviews?.length || 0} Royal Reviews</span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl md:text-4xl font-black text-royal-red">₹{product.price}</span>
                                    <span className="text-sm font-bold text-gray-400 line-through">₹{Math.floor(product.price * 1.2)}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-lg font-light leading-relaxed border-l-2 border-royal-gold/20 pl-6 py-2">
                                {product.description}
                            </p>

                            <div className="flex flex-col gap-6 pt-10 border-t border-gray-100/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Stock Availability</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-4 py-1 rounded-full uppercase tracking-tighter">
                                        {product.quantityAvailable > 0 ? `${product.quantityAvailable} Pieces Available` : 'Limited Reservation Only'}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleWishlist}
                                        className={`flex-1 py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-premium flex items-center justify-center gap-3 ${isLiked ? 'bg-royal-black text-white' : 'red-gradient text-white hover:scale-[1.02] active:scale-95'}`}
                                    >
                                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                        {isLiked ? 'In Your Curations' : 'Add to Collection'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="glass-card p-6 rounded-3xl space-y-2 border border-white/40">
                                        <ShieldCheck size={24} className="text-royal-gold" />
                                        <h4 className="font-bold text-sm text-gray-900">Certified Quality</h4>
                                        <p className="text-[10px] text-gray-500 font-medium">Handpicked & authenticated</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-16 border-t border-gray-100/50">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">Divine Reviews</h2>
                            <p className="text-gray-500 text-sm font-medium">Voices from our spiritual community.</p>
                        </div>

                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-8">
                                {product.reviews.map((rev, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center font-bold text-red-600 uppercase text-xs">
                                                    {rev.userId?.firstName?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{rev.userId?.firstName} {rev.userId?.lastName}</h4>
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className={i < rev.rating ? "fill-royal-gold text-royal-gold" : "text-gray-200"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {new Date(rev.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed italic font-medium">
                                            "{rev.comment}"
                                        </p>
                                        {rev.image && (
                                            <div className="pt-2">
                                                <img src={rev.image} alt="User Review" className="h-40 w-40 object-cover rounded-2xl shadow-lg border-4 border-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 px-8 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center space-y-4">
                                <Star size={40} className="mx-auto text-gray-100" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Be the first to leave a royal review</p>
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-32 h-fit">
                        {user ? (
                            <ReviewForm onSubmit={handleReviewSubmit} loading={reviewLoading} />
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-premium space-y-6">
                                <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto">
                                    <Sparkles size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900">Join the Circle</h3>
                                    <p className="text-gray-500 text-sm font-medium">Please login to share your divine experience with this piece.</p>
                                </div>
                                <Link to="/login" className="block w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100">
                                    Login to Review
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
