(function () {
  var initialized = false;

  function safeBindNavbarToggle() {
    var menuBtn = document.querySelector(".menu-btn");
    var navlinks = document.querySelector(".nav-links");
    if (menuBtn && navlinks) {
      menuBtn.addEventListener("click", function () {
        navlinks.classList.toggle("mobile-menu");
      });
    }
  }

  function initUI() {
    if (initialized) return;
    initialized = true;

    // Highlight only the current page link based on URL
    (function setActiveNavByPath() {
      var path = window.location.pathname.replace(/\\/g, "/");
      var links = document.querySelectorAll(".nav-links a.cir_border");
      links.forEach(function (a) {
        a.classList.remove("active");
        a.style.border = "none";
        try {
          var href = a.getAttribute("href") || "";
          if (href === "/" && (path === "/" || path.endsWith("index.html"))) {
            a.classList.add("active");
          } else if (href.length > 1 && path.endsWith(href)) {
            a.classList.add("active");
          }
        } catch (e) {}
      });
      // style via CSS using .nav-links a.active
    })();

    $("#about").on("mouseover", function () {
      introAboutLogoTransition();
    });

    $("input").on("change", function () {
      $("body").toggleClass("blue");
    });

    var checkbox = document.getElementById("checkbox");
    function checkDarkMode() {
      if (
        localStorage.getItem("tourism_website_darkmode") !== null &&
        localStorage.getItem("tourism_website_darkmode") === "true"
      ) {
        document.body.classList.add("dark");
        if (checkbox) checkbox.checked = true;
      }
    }
    checkDarkMode();
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        document.body.classList.toggle("dark");
        document.body.classList.contains("dark")
          ? localStorage.setItem("tourism_website_darkmode", true)
          : localStorage.setItem("tourism_website_darkmode", false);
      });
    }

    var mybutton = document.getElementById("upbtn");
    function scrollFunction() {
      if (!mybutton) return;
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
    window.addEventListener("scroll", scrollFunction);
    window.topFunction = function () {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    // Remove scroll-based nav highlight

    window.introAboutLogoTransition = function () {
      $("#about-quad").css("top", "70%");
      $("#about-quad").css("opacity", "1");
    };

    safeBindNavbarToggle();

    // Dropdown menu functionality
    (function initDropdownMenu() {
      var dropdowns = document.querySelectorAll(".dropdown");
      var isMobile = window.innerWidth <= 768;

      function handleDropdownClick(e) {
        if (!isMobile) return;

        var dropdown = e.currentTarget.closest(".dropdown");
        if (!dropdown) return;

        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdowns.forEach(function (d) {
          if (d !== dropdown) {
            d.classList.remove("active");
          }
        });

        // Toggle current dropdown
        var isActive = dropdown.classList.contains("active");
        dropdown.classList.toggle("active");

        // Smooth scroll to dropdown if it's opening
        if (!isActive) {
          setTimeout(function () {
            var dropdownMenu = dropdown.querySelector(".dropdown-menu");
            if (dropdownMenu) {
              dropdownMenu.scrollTop = 0;
            }
          }, 100);
        }
      }

      function handleOutsideClick(e) {
        if (!isMobile) return;

        var clickedDropdown = e.target.closest(".dropdown");
        if (!clickedDropdown) {
          dropdowns.forEach(function (dropdown) {
            dropdown.classList.remove("active");
          });
        }
      }

      function handleResize() {
        var newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
          isMobile = newIsMobile;
          // Close all dropdowns on resize
          dropdowns.forEach(function (dropdown) {
            dropdown.classList.remove("active");
          });
        }
      }

      // Touch support for mobile
      function handleTouchStart(e) {
        if (!isMobile) return;
        var dropdown = e.target.closest(".dropdown");
        if (dropdown) {
          e.preventDefault();
        }
      }

      // Bind events
      dropdowns.forEach(function (dropdown) {
        var dropdownLink = dropdown.querySelector("a");
        if (dropdownLink) {
          dropdownLink.addEventListener("click", handleDropdownClick);
          dropdownLink.addEventListener("touchstart", handleTouchStart, {
            passive: false,
          });
        }
      });

      document.addEventListener("click", handleOutsideClick);
      window.addEventListener("resize", handleResize);
    })();

    // Mount lightweight chatbot
    (function initChatbot() {
      var root = document.getElementById("hnv-chatbot-root");
      if (!root) return;
      root.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "hnv-chat";
      wrap.innerHTML =
        '\n                <button class="hnv-chat__toggle" aria-label="Chat"><i class="fa fa-comments"></i></button>\n                <div class="hnv-chat__panel" role="dialog" aria-label="Chatbot">\n                    <div class="hnv-chat__header">Hà Nội Vibes - Trợ lý du lịch</div>\n                    <div class="hnv-chat__body">\n                        <div class="hnv-quick">\n                            <button class="hnv-chip" data-q="Gợi ý lịch trình 2 ngày?">Gợi ý lịch trình 2 ngày?</button>\n                            <button class="hnv-chip" data-q="Ăn gì ở Phố cổ?">Ăn gì ở Phố cổ?</button>\n                            <button class="hnv-chip" data-q="Phương tiện di chuyển?">Phương tiện di chuyển?</button>\n                            <button class="hnv-chip" data-q="Top điểm check-in">Top điểm check-in</button>\n                        </div>\n                        <div class="hnv-chat__messages" id="hnvMsgs">\n                            <div class="hnv-msg hnv-msg--bot">Xin chào! Bạn muốn đi đâu ở Hà Nội?</div>\n                        </div>\n                    </div>\n                    <div class="hnv-chat__footer">\n                        <input class="hnv-input" id="hnvInput" type="text" placeholder="Nhập câu hỏi của bạn..." />\n                        <button class="hnv-send" id="hnvSend" aria-label="Gửi"><i class="fa fa-paper-plane"></i></button>\n                    </div>\n                </div>';
      root.appendChild(wrap);

      var toggle = wrap.querySelector(".hnv-chat__toggle");
      var panel = wrap.querySelector(".hnv-chat__panel");
      if (toggle && panel) {
        toggle.addEventListener("click", function () {
          panel.style.display =
            panel.style.display === "block" ? "none" : "block";
        });
      }

      // simple local echo for input
      var input = wrap.querySelector("#hnvInput");
      var send = wrap.querySelector("#hnvSend");
      var msgs = wrap.querySelector("#hnvMsgs");
      var history = [];
      var busy = false;
      var lastSent = 0;
      function sendToApi(text) {
        busy = true;
        lastSent = Date.now();
        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        })
          .then(function (r) {
            if (r.status === 429) throw new Error("Too Many Requests");
            return r.json();
          })
          .then(function (data) {
            return (data && data.content) || "Xin lỗi, có lỗi xảy ra.";
          })
          .catch(function (e) {
            return e && e.message === "Too Many Requests"
              ? "Hệ thống đang bận, vui lòng thử lại sau vài giây."
              : "Không thể kết nối máy chủ.";
          })
          .finally(function () {
            busy = false;
          });
      }

      function echo() {
        if (!input || !msgs) return;
        var v = (input.value || "").trim();
        if (!v) return;
        var me = document.createElement("div");
        me.className = "hnv-msg hnv-msg--me";
        me.textContent = v;
        msgs.appendChild(me);
        history.push({ role: "user", content: v });
        input.value = "";
        var bot = document.createElement("div");
        bot.className = "hnv-msg hnv-msg--bot";
        bot.textContent = "...";
        msgs.appendChild(bot);
        msgs.scrollTop = msgs.scrollHeight;
        if (busy) {
          bot.textContent = "Vui lòng chờ giây lát...";
          return;
        }
        var now = Date.now();
        var wait = Math.max(0, 1000 - (now - lastSent));
        setTimeout(function () {
          sendToApi(v).then(function (reply) {
            history.push({ role: "assistant", content: reply });
            bot.textContent = reply;
            msgs.scrollTop = msgs.scrollHeight;
          });
        }, wait);
      }
      if (send)
        send.addEventListener("click", function (e) {
          e.preventDefault();
          echo();
        });
      if (input)
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            echo();
          }
        });

      // Quick chips: click to auto-send
      var quick = wrap.querySelector(".hnv-quick");
      if (quick) {
        quick.addEventListener("click", function (e) {
          var chip = e.target.closest(".hnv-chip");
          if (!chip) return;
          var q = chip.getAttribute("data-q") || chip.textContent || "";
          input.value = q.trim();
          echo();
        });
      }
    })();
  }

  document.addEventListener("partials:loaded", initUI);

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // If partials aren't used on this page, still initialize after DOM is ready
    if (document.querySelector(".navbar")) initUI();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.querySelector(".navbar")) initUI();
    });
  }
})();
