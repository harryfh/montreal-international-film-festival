const allLinks = document.querySelectorAll("a:link");
//const mybutton = document.getElementById("goBack")
allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");
    if (href === "#" || href.startsWith("#")) {
      e.preventDefault();
    }

    console.log(href);
    // Scroll To Top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll Else
    if (href !== "#" && href.startsWith("#")) {
      const sectionElement = document.querySelector(href);
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }

    // if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    //     mybutton.style.opacity = "1";
    // } else {
    //     mybutton.style.opacity = "0";
    // }
  });
});
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));
  if (document.body) {
    document.body.appendChild(flex);
    var isSupported = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    console.log(isSupported);

    if (!isSupported) document.body.classList.add("no-flexbox-gap");
  }
}
checkFlexGap();

// Gallery Tab Switching
function initGalleryTabs() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const galleryContents = document.querySelectorAll('.gallery-content');
  const years = ['2023', '2024', '2025'];
  let currentIndex = 1; // Start with 2024
  let autoRotateInterval = null;
  let userInteracted = false;

  function switchToTab(year) {
    // Remove active class from all tabs and hide all gallery contents
    tabs.forEach(tab => tab.classList.remove('active'));
    galleryContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and show corresponding gallery content
    const selectedTab = document.querySelector(`.gallery-tab[data-year="${year}"]`);
    const selectedContent = document.querySelector(`.gallery-content[data-year="${year}"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedContent) selectedContent.classList.add('active');

    // Update background colors for wrapper and barbie section
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const barbieSection = document.querySelector('.barbie');
    
    if (galleryWrapper) galleryWrapper.setAttribute('data-active-year', year);
    if (barbieSection) barbieSection.setAttribute('data-active-year', year);

    // Update current index
    currentIndex = years.indexOf(year);

    // Update URL hash without scrolling
    if (history.pushState) {
      history.pushState(null, null, `#gallery-${year}`);
    } else {
      window.location.hash = `#gallery-${year}`;
    }
  }

  // Auto-rotate through galleries
  function startAutoRotate() {
    if (autoRotateInterval) return; // Already running
    
    autoRotateInterval = setInterval(() => {
      if (!userInteracted) {
        currentIndex = (currentIndex + 1) % years.length;
        switchToTab(years[currentIndex]);
      }
    }, 5000); // Switch every 5 seconds
  }

  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }
  }

  // Add click event listeners to tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const year = this.getAttribute('data-year');
      userInteracted = true;
      switchToTab(year);
      
      // Resume auto-rotate after 10 seconds of inactivity
      setTimeout(() => {
        userInteracted = false;
      }, 10000);
    });
  });

  // Pause auto-rotate on hover
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  if (galleryWrapper) {
    galleryWrapper.addEventListener('mouseenter', () => {
      userInteracted = true;
    });
    
    galleryWrapper.addEventListener('mouseleave', () => {
      setTimeout(() => {
        userInteracted = false;
      }, 2000);
    });
  }

  // Handle initial load and hash navigation
  function handleInitialLoad() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#gallery-')) {
      const year = hash.replace('#gallery-', '');
      if (year && document.querySelector(`.gallery-content[data-year="${year}"]`)) {
        switchToTab(year);
        startAutoRotate();
        return;
      }
    }
    // Default to 2024 if no hash or invalid hash
    switchToTab('2024');
    startAutoRotate();
  }

  // Handle hash changes (browser back/forward)
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#gallery-')) {
      const year = hash.replace('#gallery-', '');
      if (year && document.querySelector(`.gallery-content[data-year="${year}"]`)) {
        switchToTab(year);
      }
    }
  });

  // Initialize on page load
  handleInitialLoad();
}

// Initialize gallery tabs when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalleryTabs);
} else {
  initGalleryTabs();
}
