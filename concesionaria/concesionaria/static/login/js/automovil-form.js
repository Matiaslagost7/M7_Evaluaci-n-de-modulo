// Preview de imagen al seleccionar archivo
document.addEventListener('DOMContentLoaded', function() {
    const imagenInput = document.querySelector('input[type="file"][accept="image/*"]');
    
    if (imagenInput) {
        imagenInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const previewImg = document.getElementById('previewImg');
            const imagePreview = document.getElementById('imagePreview');
            
            if (file && previewImg && imagePreview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else if (imagePreview) {
                imagePreview.style.display = 'none';
            }
        });
    }
});
