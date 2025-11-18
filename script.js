// script.js

// Toàn bộ logic JS chính cho trang elnlcachnn
document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Smooth scroll cho các anchor
  // ===============================
  const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

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
  // Logic cho form "Nhắn cho anh" → gửi tới Google Apps Script
  // ===========================================
  const contactForm = document.getElementById("contact-form");
  const popup = document.getElementById("thankyou-popup");
  const popupCloseBtn = popup?.querySelector(".popup-close-btn");

  // TODO: DÁN URL WEB APP CỦA BẠN VÀO ĐÂY
  const CONTACT_API_URL = "https://script.google.com/macros/s/AKfycbyswEUr5y7dO5vEPGNka0zxGldLf2qf1dPmzY3PTzVfo9S9143ryqujPfAjKXNb69UZ/exec";

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // không cho submit bình thường

      const nameInput = contactForm.querySelector("#name");
      const messageInput = contactForm.querySelector("#message");

      const nameValue = nameInput ? nameInput.value.trim() : "";
      const messageValue = messageInput ? messageInput.value.trim() : "";

      if (!messageValue) {
        alert("Em có thể viết cho anh vài dòng trước khi gửi nhé.");
        return;
      }

      // Chuẩn bị dữ liệu gửi lên Apps Script
      const formData = new FormData();
      formData.append("name", nameValue);
      formData.append("message", messageValue);
      formData.append("userAgent", navigator.userAgent || "");
      formData.append("pageUrl", window.location.href || "");

      // Gửi tới Google Apps Script
      // mode: "no-cors" → chấp nhận request ẩn danh, không cần user đăng nhập
      fetch(CONTACT_API_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      }).catch((error) => {
        console.error("Lỗi khi gửi form tới Apps Script:", error);
      });

      // Cho trải nghiệm mềm hơn: hiện popup + reset form
      if (popup) {
        popup.classList.add("show");
        popup.setAttribute("aria-hidden", "false");
      }
      contactForm.reset();
    });
  }

  // Đóng popup khi bấm nút "Đóng nhẹ" hoặc bấm ra ngoài
  if (popup && popupCloseBtn) {
    popupCloseBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
    });

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
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
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

  // ===========================================
  // Teaser "Đừng lướt.." – set delay cho từng dòng
  // ===========================================
  const teaserLines = document.querySelectorAll("#scroll-teaser .teaser-line");

  teaserLines.forEach((line, index) => {
    const baseDelay = 0.15; // giây
    const step = 0.12; // giây giữa các dòng
    const totalDelay = baseDelay + index * step;
    line.style.transitionDelay = `${totalDelay}s`;
  });
});
