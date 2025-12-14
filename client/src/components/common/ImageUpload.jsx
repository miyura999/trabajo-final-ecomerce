import { useState } from 'react';

const ImageUpload = ({ onImageSelect, onUploadComplete, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const CLOUD_NAME = "dzkjoguoc";
  const PRESET_NAME = "ml_default";

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', PRESET_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onUploadComplete(data.secure_url);
      } else {
        throw new Error('No se recibió URL de la imagen');
      }
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
      setPreview(null);
      onUploadComplete(null); // 👈 Limpiar URL en caso de error
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUploadComplete(null); // 👈 Notificar al padre que se limpió
  };

  return (
    <div className="relative">
      {preview && (
        <div className="mb-2 relative inline-block">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-32 rounded-lg"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition shadow-lg"
          >
            ×
          </button>
        </div>
      )}
      
      {!preview && (
        <label className={`cursor-pointer ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
          <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm">Subiendo...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Adjuntar imagen</span>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageUpload;