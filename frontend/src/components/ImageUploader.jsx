import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/cropUtils';
import imageCompression from 'browser-image-compression';
import { Camera, Image as ImageIcon, X, Check, RotateCw, Plus, Trash2, Smartphone, AlertCircle } from 'lucide-react';

/* 
  PROPS:
  - existingImages: Array of URLs (strings)
  - newImages: Array of File objects (the currently staged new files)
  - onImagesChange: function(updatedNewImages) -> Update parent state
  - onRemoveExisting: function(index) -> Handle removal of existing URL
  - maxImages: Number (default 5)
*/

const ImageUploader = ({
    existingImages = [],
    newImages = [],
    onImagesChange,
    onRemoveExisting,
    maxImages = 5
}) => {
    // MODES: 'view', 'crop', 'camera'
    const [mode, setMode] = useState('view');

    // CROP STATE
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);

    // CAMERA STATE
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    const fileInputRef = useRef(null);

    const totalCount = existingImages.length + newImages.length;

    const [isLargeFile, setIsLargeFile] = useState(false);

    // --- FILE SELECTION ---
    const onFileSelect = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Check size (500KB)
            if (file.size > 500 * 1024) {
                setIsLargeFile(true);
            } else {
                setIsLargeFile(false);
            }

            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setMode('crop');
            // Clear input so same file can be selected again if needed
            e.target.value = '';
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    // --- CAMERA HANDLERS ---
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setMode('camera');
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            alert("Could not access camera: " + err.message);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');

        // Calculate approximate size in bytes
        const sizeInBytes = 4 * Math.ceil((dataUrl.length / 3)) * 0.5624896334383812; // Approximation
        // Simplest: (dataUrl.length * (3/4))
        const approxBytes = dataUrl.length * (3 / 4);

        if (approxBytes > 500 * 1024) {
            setIsLargeFile(true);
        } else {
            setIsLargeFile(false);
        }

        stopCamera();
        setImageSrc(dataUrl);
        setMode('crop');
    };

    const closeCamera = () => {
        stopCamera();
        setMode('view');
    };

    // Need to attach stream to video element when mode changes to camera
    React.useEffect(() => {
        if (mode === 'camera' && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [mode, stream]);

    // --- CROP HANDLERS ---
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const processCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsCompressing(true);
        try {
            // 1. Get Blob from Canvas
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);

            // 2. Compress
            const options = {
                maxSizeMB: 0.48, // slightly less than 0.5 to be safe
                maxWidthOrHeight: 1200, // Reasonable max dimension
                useWebWorker: true,
                fileType: "image/jpeg"
            };

            let compressedFile = await imageCompression(croppedBlob, options);

            // Force file name (Browser image compression might drop it)
            const newFile = new File([compressedFile], `product-img-${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });

            // 3. Update Parent
            onImagesChange([...newImages, newFile]);

            // 4. Reset
            setMode('view');
            setImageSrc(null);
            setRotation(0);
            setZoom(1);

        } catch (e) {
            console.error(e);
            alert('Something went wrong processing the image.');
        } finally {
            setIsCompressing(false);
        }
    };

    const cancelCrop = () => {
        setMode('view');
        setImageSrc(null);
        setRotation(0);
        setZoom(1);
    };

    // --- RENDER HELPERS ---
    const removeNew = (index) => {
        const updated = [...newImages];
        updated.splice(index, 1);
        onImagesChange(updated);
    };


    // --- UI RENDERING ---

    // 1. CAMERA MODE
    if (mode === 'camera') {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
                <div className="relative w-full h-full max-w-lg aspect-[9/16] bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Camera Controls */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
                        <button
                            onClick={closeCamera}
                            className="p-4 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur"
                        >
                            <X size={24} />
                        </button>
                        <button
                            onClick={capturePhoto}
                            className="p-1 rounded-full border-4 border-white"
                        >
                            <div className="w-16 h-16 bg-white rounded-full"></div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. CROP PREVIEW MODE
    if (mode === 'crop') {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden flex flex-col h-[80vh]">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Edit Image</h3>
                        <button onClick={cancelCrop} className="text-gray-500 hover:text-gray-800"><X /></button>
                    </div>

                    <div className="relative flex-1 bg-gray-900">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={1} // Square aspect ratio
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <div className="p-6 space-y-4 bg-white">
                        {isLargeFile && (
                            <div className="bg-orange-50 text-orange-700 p-3 rounded-xl flex items-center gap-3 text-sm border border-orange-100">
                                <AlertCircle size={20} className="flex-shrink-0" />
                                <div>
                                    <span className="font-bold block">Large Image Detected</span>
                                    File is &gt; 500KB. It will be automatically compressed significantly.
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500">Zoom</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(e.target.value)}
                                className="flex-1 accent-red-600"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500">Rotate</span>
                            <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                onChange={(e) => setRotation(e.target.value)}
                                className="flex-1 accent-red-600"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={cancelCrop}
                                className="flex-1 py-3 text-gray-600 font-bold border border-gray-200 rounded-xl hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processCroppedImage}
                                disabled={isCompressing}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                                {isCompressing ? (
                                    <>Compressing...</>
                                ) : (
                                    <><Check size={20} /> Done</>
                                )}
                            </button>
                        </div>
                        {isCompressing && (
                            <p className="text-xs text-center text-orange-500 flex items-center justify-center gap-1">
                                <AlertCircle size={12} /> Compressing to {'<'} 500KB...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 3. NORMAL VIEW MODE (Grid of images + Add Buttons)
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 ml-1">Product Images</label>
                <span className={`text-xs font-bold ${totalCount >= maxImages ? 'text-red-500' : 'text-gray-500'}`}>
                    {totalCount}/{maxImages} images
                </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">

                {/* Existing Images from Server */}
                {existingImages.map((url, i) => (
                    <div key={`exist-${i}`} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                        <img src={url} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(i)}
                                className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Staged New Images */}
                {newImages.map((file, i) => (
                    <div key={`new-${i}`} className="aspect-square relative rounded-xl overflow-hidden border border-green-200 group bg-gray-50">
                        <img src={URL.createObjectURL(file)} alt={`New ${i}`} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">New</span>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeNew(i)}
                                className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* ADD ACTIONS */}
                {totalCount < maxImages && (
                    <>
                        {/* File Upload Button */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-colors text-gray-400 hover:text-red-500"
                            title="Upload from Device"
                        >
                            <ImageIcon size={24} />
                            <span className="text-[10px] font-bold mt-1">Upload</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Camera Button */}
                        <div
                            onClick={startCamera}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-colors text-gray-400 hover:text-red-500"
                            title="Take Photo"
                        >
                            <Camera size={24} />
                            <span className="text-[10px] font-bold mt-1">Camera</span>
                        </div>
                    </>
                )}
            </div>

            {/* Info Hint */}
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <Check size={10} /> Images are automatically cropped 1:1 and compressed to {'<'}500KB.
            </p>
        </div>
    );
};

export default ImageUploader;
