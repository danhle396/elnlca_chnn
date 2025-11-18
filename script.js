// script.js

// Toàn bộ logic JS chính cho trang elnlcachnn
document.addEventListener("DOMContentLoaded", () => {
    // ===============================
    // Smooth scroll cho các anchor
    // ===============================
    const navLinks = document.querySelectorAll(
      'a[href^="#"]:not([href="#"])'
    );
  
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);
  
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  
    // ===========================================
    // IntersectionObserver để kích hoạt animation
    // ===========================================
    const revealElements = document.querySelectorAll(".reveal");
  
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              // Sau khi đã hiển thị thì không cần observe nữa
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15, // hiển thị khi khoảng 15% phần tử đã vào viewport
        }
      );
  
      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback: nếu trình duyệt không hỗ trợ IntersectionObserver
      revealElements.forEach((el) => el.classList.add("is-visible"));
    }
  
    // ===========================================
    // Logic cho form "Gửi (giả vờ)" ở phần contact
    // ===========================================
    const contactForm = document.getElementById("contact-form");
    const popup = document.getElementById("thankyou-popup");
    const popupCloseBtn = popup?.querySelector(".popup-close-btn");
  
    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const nameInput = contactForm.querySelector("#name");
        const messageInput = contactForm.querySelector("#message");
  
        const nameValue = nameInput ? nameInput.value.trim() : "";
        const messageValue = messageInput ? messageInput.value.trim() : "";
  
        // Log dữ liệu ra console (chỉ thấy tại máy người dùng)
        console.log("✉️ Tin nhắn (giả vờ) từ elnlcachnn:");
        console.log("Tên:", nameValue || "(không ghi tên)");
        console.log("Nội dung:", messageValue || "(để trống)");
  
        // Hiển thị popup cảm ơn
        if (popup) {
          popup.classList.add("show");
          popup.setAttribute("aria-hidden", "false");
        }
  
        // Có thể tùy chọn: reset form sau khi "gửi"
        contactForm.reset();
      });
    }
  
    // Đóng popup khi bấm nút "Đóng nhẹ"
    if (popup && popupCloseBtn) {
      popupCloseBtn.addEventListener("click", () => {
        popup.classList.remove("show");
        popup.setAttribute("aria-hidden", "true");
      });
  
      // Đóng khi click ra vùng overlay ngoài popup-inner
      popup.addEventListener("click", (event) => {
        if (event.target === popup) {
          popup.classList.remove("show");
          popup.setAttribute("aria-hidden", "true");
        }
      });
    }
  
    // ===========================================
    // Nút "Back to top" nổi ở góc dưới
    // ===========================================
    const backToTopBtn = document.getElementById("back-to-top");
  
    const toggleBackToTop = () => {
      if (!backToTopBtn) return;
      const scrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    };
  
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  
      window.addEventListener("scroll", toggleBackToTop);
      // Gọi một lần để cập nhật trạng thái đúng ngay khi load
      toggleBackToTop();
    }
  });
  