/**
 * Compresses an image file to a target size in KB.
 * @param {File} file - The image file to compress.
 * @param {number} targetSizeKB - The target size in KB.
 * @returns {Promise<File|Blob>} - The compressed image file.
 */
export const compressImage = async (file, targetSizeKB = 150) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Initial scale down if very large
                const maxDimension = 1200;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.9;
                const targetSizeBytes = targetSizeKB * 1024;

                const attemptCompression = (q) => {
                    canvas.toBlob((blob) => {
                        if (blob.size <= targetSizeBytes || q <= 0.1) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            attemptCompression(q - 0.1);
                        }
                    }, 'image/jpeg', q);
                };

                attemptCompression(quality);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
