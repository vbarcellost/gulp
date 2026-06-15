// Galeria Interativa
(function () {
  'use strict';

  // Aguarda o DOM carregar
  document.addEventListener('DOMContentLoaded', function () {
    initGallery();
    initSmoothScroll();
    initLazyLoad();
  });

  /**
   * Inicializa a galeria com lightbox simples
   */
  function initGallery() {
    var items = document.querySelectorAll('.gallery__item img');

    if (!items.length) return;

    // Cria overlay de lightbox
    var overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.style.cssText = [
      'display:none', 'position:fixed', 'inset:0',
      'background:rgba(0,0,0,0.85)', 'z-index:1000',
      'align-items:center', 'justify-content:center', 'cursor:zoom-out'
    ].join(';');

    var lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:6px;box-shadow:0 0 40px rgba(0,0,0,0.6)';

    overlay.appendChild(lightboxImg);
    document.body.appendChild(overlay);

    // Abre lightbox ao clicar na imagem
    items.forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    // Fecha lightbox ao clicar fora
    overlay.addEventListener('click', function () {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    // Fecha com tecla ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Scroll suave para links âncoras
   */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /**
   * Lazy loading de imagens usando IntersectionObserver
   */
  function initLazyLoad() {
    var lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });

      lazyImages.forEach(function (img) {
        observer.observe(img);
      });
    } else {
      // Fallback para navegadores sem suporte
      lazyImages.forEach(function (img) {
        img.src = img.dataset.src;
      });
    }
  }

})();
