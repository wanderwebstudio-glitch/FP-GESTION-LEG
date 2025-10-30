
  // Seleccionamos los elementos por ID
  const viewer = document.getElementById('imageViewer');
  const viewerImage = document.getElementById('viewerImage');
  const closeViewer = document.getElementById('closeViewer');
  const gallerySection = document.getElementById('gallerySection');

  // Detectar clics en las imágenes dentro de la galería
  gallerySection.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      const imageSrc = e.target.getAttribute('src');
      viewerImage.setAttribute('src', imageSrc);
      viewer.classList.add('active');
    }
  });

  // Cerrar al hacer clic en la X
  closeViewer.addEventListener('click', () => {
    viewer.classList.remove('active');
  });

  // Cerrar si se hace clic fuera de la imagen
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) {
      viewer.classList.remove('active');
    }
  });

