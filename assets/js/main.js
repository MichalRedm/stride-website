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

  // --- Active Navbar Highlighting ---
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id], footer[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const isActive = link.getAttribute('data-section') === id;
          link.classList.toggle('active-nav', isActive);
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // Triggers when section occupies the middle 20% of the viewport
    threshold: 0
  });

  sections.forEach(section => navObserver.observe(section));

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

  // --- Video Timestamp Functionality ---
  const videoIframe = document.getElementById('demo-video');
  const timestampContainer = document.getElementById('timestamps-container');

  if (videoIframe && timestampContainer) {
    // Fetch timestamps from JSON
    fetch('./assets/data/timestamps.json')
      .then(response => response.json())
      .then(data => {
        // Render timestamps
        data.forEach((item) => {
          const parts = item.time.split(':');
          let displayTime = item.time;
          if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) {
              parts[parts.length - 1] = Math.floor(parseFloat(lastPart)).toString().padStart(2, '0');
              displayTime = parts.join(':');
            }
          }

          const div = document.createElement('div');
          div.className = "flex gap-4 items-start p-3 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group";
          div.dataset.time = item.time;
          div.innerHTML = `
            <span class="text-sm font-bold text-secondary-accent w-12 pt-1 font-inter">${displayTime}</span>
            <div class="flex-1">
              <h4 class="font-bold text-primary-dark group-hover:text-secondary-accent transition-colors">${item.title}</h4>
              <p class="text-xs text-slate-500 mt-1">${item.description}</p>
            </div>
          `;
          timestampContainer.appendChild(div);
        });

        initVideoTimestamps();
      })
      .catch(error => console.error("Error loading timestamps:", error));
  }

  function initVideoTimestamps() {
    const timestampButtons = timestampContainer.querySelectorAll(':scope > div');
    if (timestampButtons.length === 0) return;

    // Parse timestamps
    const timestamps = Array.from(timestampButtons).map(btn => {
      const timeStr = btn.dataset.time || '0:00';
      const parts = timeStr.split(':');
      let seconds = 0;
      if (parts.length === 2) {
        seconds = parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
      } else if (parts.length === 3) {
        seconds = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseFloat(parts[2]);
      } else {
        seconds = parseFloat(timeStr);
      }
      return { seconds, element: btn };
    });

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    let timeUpdateInterval;
    let currentActiveIndex = -1;

    window.onYouTubeIframeAPIReady = function() {
      player = new YT.Player('demo-video', {
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    };

    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING) {
        updateActiveTimestamp();
        timeUpdateInterval = setInterval(updateActiveTimestamp, 250);
      } else {
        clearInterval(timeUpdateInterval);
      }
    }

    function updateActiveTimestamp() {
      if (!player || !player.getCurrentTime) return;
      const currentTime = player.getCurrentTime();
      
      let activeIndex = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (currentTime >= timestamps[i].seconds) {
          activeIndex = i;
        } else {
          break;
        }
      }

      if (activeIndex !== currentActiveIndex) {
        currentActiveIndex = activeIndex;
        
        timestamps.forEach((item, index) => {
          const title = item.element.querySelector('h4');
          if (index === activeIndex) {
            item.element.classList.add('bg-white', 'border-slate-200', 'shadow-md');
            item.element.classList.remove('border-transparent');
            if (title) {
              title.classList.add('text-secondary-accent');
              title.classList.remove('text-primary-dark', 'group-hover:text-secondary-accent');
            }
            
            if (timestampContainer) {
              const containerHalf = timestampContainer.clientHeight / 2;
              const itemHalf = item.element.clientHeight / 2;
              const scrollPos = (item.element.offsetTop - timestampContainer.offsetTop) - containerHalf + itemHalf;
              timestampContainer.scrollTo({
                top: scrollPos,
                behavior: 'smooth'
              });
            }
          } else {
            item.element.classList.remove('bg-white', 'border-slate-200', 'shadow-md');
            item.element.classList.add('border-transparent');
            if (title) {
              title.classList.remove('text-secondary-accent');
              title.classList.add('text-primary-dark', 'group-hover:text-secondary-accent');
            }
          }
        });
      }
    }

    // Click handling
    timestamps.forEach((item) => {
      item.element.addEventListener('click', () => {
        if (player && player.seekTo) {
          player.seekTo(item.seconds, true);
          player.playVideo();
        } else {
          videoIframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [item.seconds, true]
          }), '*');
          videoIframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
          }), '*');
        }
      });
    });
  }
});
