document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enabled");

  const header = document.getElementById("siteHeader");
  const mobileToggle = document.getElementById("mobileToggle");
  const mainNav = document.getElementById("mainNav");
  const revealItems = document.querySelectorAll(".reveal");
  const faqButtons = document.querySelectorAll(".faq-question");
  const filterButtons = document.querySelectorAll(".gallery-filter");
  const recipeCards = document.querySelectorAll(".recipe-card");

  const handleHeader = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 10);
    }
  };

  handleHeader();
  window.addEventListener("scroll", handleHeader, { passive: true });

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
      mobileToggle.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        mainNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || 0;

            setTimeout(() => {
              el.classList.add("is-visible");
            }, delay);

            obs.unobserve(el);
          }
        });
      },
      {
        threshold: 0.14
      }
    );

    revealItems.forEach((item, index) => {
      item.dataset.delay = (index % 4) * 120;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("active");
        const faqAnswer = faq.querySelector(".faq-answer");
        if (faqAnswer) faqAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  if (filterButtons.length && recipeCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        recipeCards.forEach((card) => {
          const category = card.getAttribute("data-category");

          if (filter === "all" || category === filter) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* ABOUT PAGE MOTION */
  if (document.body.classList.contains("about-page")) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectAboutMotionStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .motion-reveal {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          will-change: opacity, transform;
        }

        .motion-reveal.from-left {
          transform: translateX(-56px);
        }

        .motion-reveal.from-right {
          transform: translateX(56px);
        }

        .motion-reveal.scale-in {
          transform: scale(0.94);
        }

        .motion-reveal.is-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .motion-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          will-change: transform;
        }

        .motion-card.is-visible:hover {
          transform: translateY(-8px);
        }

        .motion-image-wrap {
          overflow: hidden;
        }

        .motion-image {
          transition: transform 1.1s ease;
          will-change: transform;
        }

        .motion-image-wrap.is-visible .motion-image {
          transform: scale(1.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .motion-reveal,
          .motion-card,
          .motion-image {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    const markAboutMotionElements = () => {
      const revealMap = [
        [".page-header .header-content", "scale-in"],
        [".mission-heading", ""],
        [".mission-text", "from-left"],
        [".mission-image", "from-right"],
        [".philosophy-content > div:first-child", "from-left"],
        [".philosophy-content > div:last-child", "from-right"],
        [".understanding-section h2", ""],
        [".understanding-top > div:first-child", "from-left"],
        [".understanding-top > div:last-child", "from-right"],
        [".approach-section h2", ""],
        [".approach-content > div:first-child", "from-left"],
        [".approach-content > div:last-child", "from-right"],
        [".movement-content > div:first-child", "from-left"],
        [".movement-content > div:last-child", "from-right"],
        [".newsletter-content", "scale-in"]
      ];

      revealMap.forEach(([selector, extraClass]) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.classList.add("motion-reveal");
          if (extraClass) el.classList.add(extraClass);
        });
      });

      document.querySelectorAll(".understanding-cards > div").forEach((card, index) => {
        card.classList.add("motion-reveal", "motion-card");
        card.style.transitionDelay = `${index * 120}ms`;
      });

      document
        .querySelectorAll(".mission-image, .philosophy-content .relative, .understanding-top img, .approach-content img, .movement-content img")
        .forEach((wrap) => {
          wrap.classList.add("motion-image-wrap");
          const img = wrap.tagName.toLowerCase() === "img" ? wrap : wrap.querySelector("img");
          if (img) img.classList.add("motion-image");
        });
    };

    const setupAboutRevealObserver = () => {
      const items = document.querySelectorAll(".motion-reveal, .motion-image-wrap");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      items.forEach((item) => observer.observe(item));
    };

    const setupAboutParallax = () => {
      if (prefersReducedMotion) return;

      const parallaxTargets = Array.from(
        document.querySelectorAll(
          ".mission-image img, .philosophy-content img, .understanding-top img, .approach-content img, .movement-content img"
        )
      );

      if (!parallaxTargets.length) return;

      const handleParallax = () => {
        parallaxTargets.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const elementCenter = rect.top + rect.height / 2;
          const offset = (elementCenter - viewportCenter) * -0.03;

          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            img.style.transform = `translateY(${offset.toFixed(1)}px) scale(1.04)`;
          }
        });
      };

      handleParallax();
      window.addEventListener("scroll", handleParallax, { passive: true });
    };

    injectAboutMotionStyles();
    markAboutMotionElements();
    setupAboutRevealObserver();
    setupAboutParallax();
  }

  /* BLOG PAGE MOTION */
  if (document.body.classList.contains("blog-page")) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectBlogMotionStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .blog-page .motion-reveal {
          opacity: 0;
          transform: translateY(44px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          will-change: opacity, transform;
        }

        .blog-page .motion-reveal.scale-in {
          transform: scale(0.96);
        }

        .blog-page .motion-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .blog-page .motion-card {
          transition: opacity 0.8s ease, transform 0.8s ease, box-shadow 0.3s ease;
        }

        .blog-page .motion-card.is-visible:hover {
          transform: translateY(-8px);
        }

        @media (prefers-reduced-motion: reduce) {
          .blog-page .motion-reveal,
          .blog-page .motion-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    const markBlogMotionElements = () => {
      document.querySelectorAll(".mb-12, .mb-16").forEach((el) => {
        el.classList.add("motion-reveal", "scale-in");
      });

      document.querySelectorAll(".rounded-xl.overflow-hidden.bg-white, .bg-lightBg.rounded-xl").forEach((card, index) => {
        card.classList.add("motion-reveal", "motion-card");
        card.style.transitionDelay = `${Math.min(index * 90, 450)}ms`;
      });

      document.querySelectorAll(".px-6.py-2.rounded-full").forEach((filter, index) => {
        filter.classList.add("motion-reveal");
        filter.style.transitionDelay = `${index * 70}ms`;
      });
    };

    const setupBlogObserver = () => {
      const items = document.querySelectorAll(".blog-page .motion-reveal");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      items.forEach((item) => observer.observe(item));
    };

    injectBlogMotionStyles();
    markBlogMotionElements();
    setupBlogObserver();
  }

  /* GALLERY PAGE MOTION */
  if (document.body.classList.contains("gallery-page")) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectGalleryMotionStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .gallery-page .gallery-motion {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.75s ease, transform 0.75s ease;
          will-change: opacity, transform;
        }

        .gallery-page .gallery-motion.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .gallery-page .gallery-hero__feature img,
        .gallery-page .recipe-card,
        .gallery-page .gallery-note,
        .gallery-page .gallery-promo__panel {
          transition: transform 0.35s ease, box-shadow 0.35s ease, opacity 0.75s ease;
        }

        .gallery-page .recipe-card.is-visible:hover {
          transform: translateY(-6px);
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-page .gallery-motion {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    const markGalleryMotionElements = () => {
      document.querySelectorAll(
        ".gallery-hero__copy, .gallery-hero__feature, .gallery-hero__notes, .gallery-filter-section, .recipe-card, .gallery-promo__panel"
      ).forEach((el, index) => {
        el.classList.add("gallery-motion");
        el.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
      });
    };

    const setupGalleryObserver = () => {
      const items = document.querySelectorAll(".gallery-page .gallery-motion");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      items.forEach((item) => observer.observe(item));
    };

    injectGalleryMotionStyles();
    markGalleryMotionElements();
    setupGalleryObserver();
  }

  /* NUTRITION PAGE MOTION */
  if (
    document.body.classList.contains("nutrition-page") &&
    document.querySelector(".quick-start-box")
  ) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectNutritionMotionStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .nutrition-page .nutrition-motion {
          opacity: 0;
          transform: translateY(34px);
          transition: opacity 0.78s ease, transform 0.78s ease;
          will-change: opacity, transform;
        }

        .nutrition-page .nutrition-motion.scale-in {
          transform: scale(0.96);
        }

        .nutrition-page .nutrition-motion.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .nutrition-page .quick-card,
        .nutrition-page .works-card,
        .nutrition-page .fails-card,
        .nutrition-page .nutrient-card,
        .nutrition-page .method-card,
        .nutrition-page .example-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease, opacity 0.78s ease;
        }

        .nutrition-page .quick-card.is-visible:hover,
        .nutrition-page .works-card.is-visible:hover,
        .nutrition-page .fails-card.is-visible:hover,
        .nutrition-page .nutrient-card.is-visible:hover,
        .nutrition-page .method-card.is-visible:hover,
        .nutrition-page .example-card.is-visible:hover {
          transform: translateY(-6px);
        }

        @media (prefers-reduced-motion: reduce) {
          .nutrition-page .nutrition-motion {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    const markNutritionMotionElements = () => {
      document.querySelectorAll(
        ".nutrition-hero .narrow-container, .quick-start-box, .cta-panel, .works-card, .fails-card, .nutrient-card, .method-card, .example-card, .fix-box, .disclaimer-box, .mistake-list li, .sources-list li"
      ).forEach((el, index) => {
        el.classList.add("nutrition-motion");
        if (el.matches(".nutrition-hero .narrow-container, .quick-start-box, .cta-panel")) {
          el.classList.add("scale-in");
        }
        el.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
      });
    };

    const setupNutritionObserver = () => {
      const items = document.querySelectorAll(".nutrition-page .nutrition-motion");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      items.forEach((item) => observer.observe(item));
    };

    injectNutritionMotionStyles();
    markNutritionMotionElements();
    setupNutritionObserver();
  }

  /* TRANSITION PAGE MOTION */
  if (document.body.classList.contains("transition-page")) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectTransitionMotionStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .transition-page .transition-motion {
          opacity: 0;
          transform: translateY(34px);
          transition: opacity 0.78s ease, transform 0.78s ease;
          will-change: opacity, transform;
        }

        .transition-page .transition-motion.scale-in {
          transform: scale(0.96);
        }

        .transition-page .transition-motion.from-left {
          transform: translateX(-40px);
        }

        .transition-page .transition-motion.from-right {
          transform: translateX(40px);
        }

        .transition-page .transition-motion.is-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .transition-page .approach-card,
        .transition-page .swap-row,
        .transition-page .info-card,
        .transition-page .works-card,
        .transition-page .fails-card,
        .transition-page .method-card,
        .transition-page .situation-item,
        .transition-page .mistake-item,
        .transition-page .checklist li {
          transition: transform 0.35s ease, box-shadow 0.35s ease, opacity 0.78s ease;
        }

        .transition-page .approach-card.is-visible:hover,
        .transition-page .swap-row.is-visible:hover,
        .transition-page .info-card.is-visible:hover,
        .transition-page .works-card.is-visible:hover,
        .transition-page .fails-card.is-visible:hover,
        .transition-page .method-card.is-visible:hover {
          transform: translateY(-6px);
        }

        @media (prefers-reduced-motion: reduce) {
          .transition-page .transition-motion {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    const markTransitionMotionElements = () => {
      const revealMap = [
        [".nutrition-hero .narrow-container", "scale-in"],
        [".quick-start-box", "scale-in"],
        [".cta-panel-top", "scale-in"],
        [".approach-card:first-child", "from-left"],
        [".approach-card:last-child", "from-right"],
        [".approach-detail", ""],
        [".swap-row", ""],
        [".plate-tabs", ""],
        [".plate-panel", ""],
        [".works-card", "from-left"],
        [".fails-card", "from-right"],
        [".info-card", ""],
        [".method-card", ""],
        [".cta-panel-mid", "scale-in"],
        [".situation-item", ""],
        [".mistake-item", ""],
        [".fix-box", "scale-in"],
        [".cta-panel-final", "scale-in"],
        [".sources-list li", ""],
        [".disclaimer-box", ""]
      ];

      revealMap.forEach(([selector, extraClass]) => {
        document.querySelectorAll(selector).forEach((el, index) => {
          el.classList.add("transition-motion");
          if (extraClass) el.classList.add(extraClass);
          el.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
        });
      });
    };

    const setupTransitionObserver = () => {
      const items = document.querySelectorAll(".transition-page .transition-motion");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      items.forEach((item) => observer.observe(item));
    };

    injectTransitionMotionStyles();
    markTransitionMotionElements();
    setupTransitionObserver();
  }

  /* BASICS PAGE MOTION */
  if (document.body.classList.contains("basics-page")) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const injectBasicsMotionStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        .basics-page .basics-motion {
          opacity: 0;
          transform: translateY(34px);
          transition: opacity 0.78s ease, transform 0.78s ease;
          will-change: opacity, transform;
        }

        .basics-page .basics-motion.scale-in {
          transform: scale(0.96);
        }

        .basics-page .basics-motion.from-left {
          transform: translateX(-40px);
        }

        .basics-page .basics-motion.from-right {
          transform: translateX(40px);
        }

        .basics-page .basics-motion.is-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .basics-page .basics-motion {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    const markBasicsMotionElements = () => {
      const revealMap = [
        [".nutrition-hero .narrow-container", "scale-in"],
        [".definition-box", "scale-in"],
        [".change-tabs", ""],
        [".change-panel", ""],
        [".eat-card", ""],
        [".comfort-callout", "scale-in"],
        [".myth-item", ""],
        [".reason-card", ""],
        [".not-card", ""],
        [".reassure-callout", "scale-in"],
        [".bridge-card:first-child", "from-left"],
        [".bridge-card:last-child", "from-right"],
        [".path-step", ""],
        [".disclaimer-box", ""]
      ];

      revealMap.forEach(([selector, extraClass]) => {
        document.querySelectorAll(selector).forEach((el, index) => {
          el.classList.add("basics-motion");
          if (extraClass) el.classList.add(extraClass);
          el.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
        });
      });
    };

    const setupBasicsObserver = () => {
      const items = document.querySelectorAll(".basics-page .basics-motion");
      if (!items.length) return;

      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      items.forEach((item) => observer.observe(item));
    };

    injectBasicsMotionStyles();
    markBasicsMotionElements();
    setupBasicsObserver();
  }

  /* VEGAN GUIDE PAGE */
  if (
    document.querySelector(".toc") &&
    document.querySelector("#planner") &&
    document.querySelector("#understand")
  ) {
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    const guideSections = document.querySelectorAll(
      "#planner, #understand, #live, #explore, #research"
    );

    tocLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const headerOffset = header ? header.offsetHeight + 24 : 24;
        const targetTop =
          target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth"
        });

        history.replaceState(null, "", targetId);
      });
    });

    const updateActiveToc = () => {
      const headerOffset = header ? header.offsetHeight + 40 : 40;
      let currentId = "";

      guideSections.forEach((section) => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          currentId = `#${section.id}`;
        }
      });

      tocLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === currentId);
      });
    };

    updateActiveToc();
    window.addEventListener("scroll", updateActiveToc, { passive: true });

    const guideRevealItems = document.querySelectorAll(
      ".planner-card, .group-header, .understand-list li, .live-list li, .explore-list li, .research .inner"
    );

    guideRevealItems.forEach((item, index) => {
      item.classList.add("guide-reveal");
      item.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
    });

    const style = document.createElement("style");
    style.textContent = `
      .guide-reveal {
        opacity: 0;
        transform: translateY(34px);
        transition: opacity 0.75s ease, transform 0.75s ease;
        will-change: opacity, transform;
      }

      .guide-reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .toc a.active {
        color: var(--primary);
      }

      @media (prefers-reduced-motion: reduce) {
        .guide-reveal {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    if ("IntersectionObserver" in window) {
      const guideObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      guideRevealItems.forEach((item) => guideObserver.observe(item));
    } else {
      guideRevealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }
});

(function () {
  var approachCards = document.querySelectorAll(".approach-card[data-approach]");
  var details = document.querySelectorAll("[data-approach-detail]");

  approachCards.forEach(function (card) {
    card.addEventListener("click", function () {
      var key = card.getAttribute("data-approach");
      var isOpen = card.getAttribute("aria-expanded") === "true";

      approachCards.forEach(function (c) {
        c.setAttribute("aria-expanded", "false");
      });
      details.forEach(function (d) {
        d.hidden = true;
      });

      if (!isOpen) {
        card.setAttribute("aria-expanded", "true");
        var match = document.querySelector('[data-approach-detail="' + key + '"]');
        if (match) match.hidden = false;
      }
    });
  });

  var tabs = document.querySelectorAll(".plate-tab");
  var panels = document.querySelectorAll(".plate-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-plate-tab");

      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      panels.forEach(function (p) {
        var isMatch = p.getAttribute("data-plate-panel") === key;
        p.classList.toggle("is-active", isMatch);
        p.hidden = !isMatch;
      });
    });
  });

  document.querySelectorAll(".swap-row").forEach(function (row) {
    row.addEventListener("click", function () {
      row.classList.toggle("is-active");
    });
  });

  var mistakeItems = document.querySelectorAll(".mistake-list .mistake-item");
  mistakeItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        mistakeItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  var list = document.getElementById("transitionChecklist");
  if (list) {
    var STORAGE_KEY = "transition-checklist-v1";
    var saved = {};

    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      saved = {};
    }

    var items = list.querySelectorAll("li");
    items.forEach(function (li, index) {
      if (saved[index]) {
        li.classList.add("is-checked");
        li.setAttribute("aria-checked", "true");
      }

      var toggle = function () {
        li.classList.toggle("is-checked");
        var checked = li.classList.contains("is-checked");
        li.setAttribute("aria-checked", checked ? "true" : "false");
        saved[index] = checked;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (e) {}
      };

      li.addEventListener("click", toggle);

      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }
})();

(function () {
  var tabs = document.querySelectorAll(".change-tab");
  var panels = document.querySelectorAll(".change-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-change-tab");

      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      panels.forEach(function (p) {
        var isMatch = p.getAttribute("data-change-panel") === key;
        p.classList.toggle("is-active", isMatch);
        p.hidden = !isMatch;
      });
    });
  });

  var mythItems = document.querySelectorAll(".myth-list .myth-item");
  mythItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        mythItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();

(function () {
  if (!("IntersectionObserver" in window)) return;

  var revealTargets = document.querySelectorAll(
    ".fashion-page .pillar, " +
    ".fashion-page .material-card, " +
    ".fashion-page .swap-row, " +
    ".fashion-page .spot-card, " +
    ".fashion-page .check-step, " +
    ".fashion-page .priority-card, " +
    ".fashion-page .dont-card, " +
    ".fashion-page .mistake-item, " +
    ".fashion-page .explain-card, " +
    ".fashion-page .bridge-card"
  );

  revealTargets.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)";
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach(function (el) {
    io.observe(el);
  });
})();

(function () {
  if (!("IntersectionObserver" in window)) return;

  var revealTargets = document.querySelectorAll(
    ".beauty-page .pillar, " +
    ".beauty-page .ingredient-card, " +
    ".beauty-page .compare-card, " +
    ".beauty-page .check-step, " +
    ".beauty-page .priority-card, " +
    ".beauty-page .dont-card, " +
    ".beauty-page .mistake-item, " +
    ".beauty-page .bridge-card"
  );

  revealTargets.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)";
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach(function (el) {
    io.observe(el);
  });
})();

/* ==========================================================
   TRAVEL PAGE — scroll-reveal animations
   Matches the pattern used by beauty.js / clothing.js
   ========================================================== */
(function () {
  if (!("IntersectionObserver" in window)) return;

  var revealTargets = document.querySelectorAll(
    ".travel-page .definition-box, " +
    ".travel-page .situation-card, " +
    ".travel-page .check-step, " +
    ".travel-page .myth-item, " +
    ".travel-page .kit-card, " +
    ".travel-page .transport-card, " +
    ".travel-page .situation-item, " +
    ".travel-page .not-card, " +
    ".travel-page .mindset-box, " +
    ".travel-page .first-step-box, " +
    ".travel-page .bridge-card, " +
    ".travel-page .comfort-callout, " +
    ".travel-page .reassure-callout, " +
    ".travel-page .disclaimer-box"
  );

  revealTargets.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition =
      "opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)";
  });

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach(function (el) {
    io.observe(el);
  });

  /* Auto-close other myth/situation accordions when one opens */
  var groups = [
    document.querySelectorAll(".travel-page .myth-list .myth-item"),
    document.querySelectorAll(".travel-page .situation-accordion .situation-item")
  ];

  groups.forEach(function (items) {
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  });
})();

(function () {
  var plannerLinks = document.querySelectorAll('a[href="meal-planner.html"], a[href="meal-planner-coming-soon.html"]');

  plannerLinks.forEach(function (link) {
    link.setAttribute("href", "meal-planner.html");

    if (link.textContent.toLowerCase().includes("coming soon")) {
      link.innerHTML = "Open Vegan Meal Planner";
    }
  });
})();