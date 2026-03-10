document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the class that triggers the Tailwind transition
        entry.target.classList.add('is-visible');
        // Optional: Unobserve if you want the animation to happen only once
        // observer.unobserve(entry.target); 
      } else {
        // Remove to allow the animation to replay when scrolling back up
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // Copy to clipboard logic
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('text-secondary-accent');
        const originalSvg = btn.innerHTML;
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
        setTimeout(() => {
          btn.classList.remove('text-secondary-accent');
          btn.innerHTML = originalSvg;
        }, 2000);
      });
    });
  });
});
