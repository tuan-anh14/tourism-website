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
        '\n                <button class="hnv-chat__toggle" aria-label="Chat"><i class="fa fa-comments"></i></button>\n                <div class="hnv-chat__panel" role="dialog" aria-label="Chatbot">\n                    <div class="hnv-chat__header">\n                        <span>Hà Nội Vibes - Trợ lý du lịch</span>\n                        <div class="hnv-chat__actions">\n                            <button class="hnv-history-btn" id="hnvHistoryBtn" title="Lịch sử chat"><i class="fa fa-history"></i></button>\n                            <button class="hnv-new-chat" id="hnvNewChat" title="Cuộc trò chuyện mới"><i class="fa fa-plus"></i></button>\n                            <button class="hnv-close-btn" id="hnvCloseBtn" title="Đóng chat"><i class="fa fa-times"></i></button>\n                        </div>\n                    </div>\n                    <div class="hnv-chat__body">\n                        <div class="hnv-quick">\n                            <button class="hnv-chip" data-q="Gợi ý lịch trình 2 ngày?">Gợi ý lịch trình 2 ngày?</button>\n                            <button class="hnv-chip" data-q="Ăn gì ở Phố cổ?">Ăn gì ở Phố cổ?</button>\n                            <button class="hnv-chip" data-q="Phương tiện di chuyển?">Phương tiện di chuyển?</button>\n                            <button class="hnv-chip" data-q="Top điểm check-in">Top điểm check-in</button>\n                        </div>\n                        <div class="hnv-chat__messages" id="hnvMsgs">\n                            <div class="hnv-msg hnv-msg--bot">Xin chào! Bạn muốn đi đâu ở Hà Nội?</div>\n                        </div>\n                    </div>\n                    <div class="hnv-chat__footer">\n                        <input class="hnv-input" id="hnvInput" type="text" placeholder="Nhập câu hỏi của bạn..." />\n                        <button class="hnv-send" id="hnvSend" aria-label="Gửi"><i class="fa fa-paper-plane"></i></button>\n                    </div>\n                </div>';
      root.appendChild(wrap);

      var toggle = wrap.querySelector(".hnv-chat__toggle");
      var panel = wrap.querySelector(".hnv-chat__panel");
      if (toggle && panel) {
        toggle.addEventListener("click", function () {
          var isOpen = panel.style.display === "block";
          panel.style.display = isOpen ? "none" : "block";
          
          // Load lịch sử chat khi mở chatbot
          if (!isOpen) {
            loadChatHistory();
          }
        });
      }

      // simple local echo for input
      var input = wrap.querySelector("#hnvInput");
      var send = wrap.querySelector("#hnvSend");
      var msgs = wrap.querySelector("#hnvMsgs");
      var newChatBtn = wrap.querySelector("#hnvNewChat");
      var historyBtn = wrap.querySelector("#hnvHistoryBtn");
      var closeBtn = wrap.querySelector("#hnvCloseBtn");
      var history = [];
      var busy = false;
      var lastSent = 0;
      var userId = localStorage.getItem('chat_user_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      var sessionId = localStorage.getItem('chat_session_id') || 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Lưu user_id và session_id vào localStorage
      localStorage.setItem('chat_user_id', userId);
      localStorage.setItem('chat_session_id', sessionId);
      
      // Function để load lịch sử chat
      function loadChatHistory() {
        fetch(`/api/chat/history?user_id=${userId}&session_id=${sessionId}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.success && data.data.length > 0) {
              var messages = data.data[0].messages;
              // Clear current messages
              msgs.innerHTML = '';
              history = [];
              
              // Load lại tất cả tin nhắn
              messages.forEach(function(msg) {
                var msgDiv = document.createElement("div");
                msgDiv.className = "hnv-msg hnv-msg--" + (msg.role === "user" ? "me" : "bot");
                msgDiv.textContent = msg.content;
                msgs.appendChild(msgDiv);
                
                // Thêm vào history
                history.push({ role: msg.role, content: msg.content });
              });
              
              // Scroll xuống cuối
              msgs.scrollTop = msgs.scrollHeight;
            } else {
              // Nếu không có lịch sử, hiển thị tin nhắn chào mặc định
              msgs.innerHTML = '<div class="hnv-msg hnv-msg--bot">Xin chào! Bạn muốn đi đâu ở Hà Nội?</div>';
              history = [];
            }
          })
          .catch(function(error) {
            console.error('Error loading chat history:', error);
            // Nếu có lỗi, hiển thị tin nhắn chào mặc định
            msgs.innerHTML = '<div class="hnv-msg hnv-msg--bot">Xin chào! Bạn muốn đi đâu ở Hà Nội?</div>';
            history = [];
          });
      }
      
      function sendToApi(text) {
        busy = true;
        lastSent = Date.now();
        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            messages: history,
            user_id: userId,
            session_id: sessionId
          }),
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
      
      // Function để tạo cuộc trò chuyện mới
      function startNewChat() {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chat_session_id', sessionId);
        history = [];
        msgs.innerHTML = '<div class="hnv-msg hnv-msg--bot">Xin chào! Bạn muốn đi đâu ở Hà Nội?</div>';
      }
      
      // Function để hiển thị lịch sử chat
      function showChatHistory() {
        // Tạo sidebar lịch sử
        var sidebar = document.getElementById('chat-history-sidebar');
        if (!sidebar) {
          sidebar = document.createElement('div');
          sidebar.id = 'chat-history-sidebar';
          sidebar.innerHTML = `
            <div class="chat-history-header">
              <h3>Lịch sử chat</h3>
              <button id="close-history-btn" class="close-history-btn">×</button>
            </div>
            <div id="sessions-list" class="sessions-list">
              <div class="loading">Đang tải...</div>
            </div>
          `;
          document.body.appendChild(sidebar);
          
          // Thêm CSS cho sidebar
          var style = document.createElement('style');
          style.textContent = `
            #chat-history-sidebar {
              position: fixed;
              right: -350px;
              top: 0;
              width: min(350px, calc(100vw - 20px));
              max-width: 350px;
              height: 100vh;
              background: #f8f9fa;
              border-left: 1px solid #dee2e6;
              transition: right 0.3s ease;
              z-index: 10000;
              overflow-y: auto;
              box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            }
            
            #chat-history-sidebar.open {
              right: 0;
            }
            
            .chat-history-header {
              padding: 20px;
              border-bottom: 1px solid #dee2e6;
              background: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .chat-history-header h3 {
              margin: 0;
              color: #333;
            }
            
            .close-history-btn {
              background: #dc3545;
              color: white;
              border: none;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              cursor: pointer;
              font-size: 16px;
            }
            
            .sessions-list {
              padding: 10px;
            }
            
            .session-item {
              padding: 12px;
              margin-bottom: 8px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e9ecef;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            
            .session-item:hover {
              background: #e9ecef;
              border-color: #007bff;
            }
            
            .session-item.active {
              background: #007bff;
              color: white;
              border-color: #007bff;
            }
            
            .session-preview {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .session-item.active .session-preview {
              color: rgba(255, 255, 255, 0.8);
            }
            
            .session-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 5px;
              font-size: 11px;
            }
            
            .session-date {
              color: #999;
            }
            
            .session-item.active .session-date {
              color: rgba(255, 255, 255, 0.7);
            }
            
            .loading {
              text-align: center;
              padding: 20px;
              color: #666;
            }
            
            @media (max-width: 768px) {
              #chat-history-sidebar {
                width: calc(100vw - 10px);
                max-width: calc(100vw - 10px);
              }
              
              .chat-history-header {
                padding: 15px;
              }
              
              .chat-history-header h3 {
                font-size: 16px;
              }
              
              .close-history-btn {
                width: 26px;
                height: 26px;
                font-size: 14px;
              }
              
              .sessions-list {
                padding: 8px;
              }
              
              .session-item {
                padding: 10px;
                margin-bottom: 6px;
              }
              
              .session-preview {
                font-size: 11px;
              }
              
              .session-meta {
                font-size: 10px;
              }
            }
            
            @media (max-width: 480px) {
              #chat-history-sidebar {
                width: calc(100vw - 5px);
                max-width: calc(100vw - 5px);
              }
              
              .chat-history-header {
                padding: 12px;
              }
              
              .chat-history-header h3 {
                font-size: 14px;
              }
              
              .close-history-btn {
                width: 24px;
                height: 24px;
                font-size: 12px;
              }
              
              .sessions-list {
                padding: 6px;
              }
              
              .session-item {
                padding: 8px;
                margin-bottom: 4px;
              }
              
              .session-preview {
                font-size: 10px;
              }
              
              .session-meta {
                font-size: 9px;
              }
            }
          `;
          document.head.appendChild(style);
          
          // Event listeners
          document.getElementById('close-history-btn').addEventListener('click', function() {
            sidebar.classList.remove('open');
          });
        }
        
        // Hiển thị sidebar
        sidebar.classList.add('open');
        
        // Load sessions
        loadUserSessions();
      }
      
      // Function để load danh sách sessions
      function loadUserSessions() {
        var sessionsList = document.getElementById('sessions-list');
        if (!sessionsList) return;
        
        sessionsList.innerHTML = '<div class="loading">Đang tải...</div>';
        
        fetch(`/api/chat/sessions?user_id=${userId}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.success) {
              renderSessions(data.data);
            } else {
              sessionsList.innerHTML = '<div class="loading">Không có lịch sử chat</div>';
            }
          })
          .catch(function(error) {
            console.error('Error loading sessions:', error);
            sessionsList.innerHTML = '<div class="loading">Lỗi khi tải lịch sử</div>';
          });
      }
      
      // Function để render sessions
      function renderSessions(sessions) {
        var container = document.getElementById('sessions-list');
        
        if (sessions.length === 0) {
          container.innerHTML = '<div class="loading">Chưa có cuộc trò chuyện nào</div>';
          return;
        }

        container.innerHTML = sessions.map(function(session) {
          return `
            <div class="session-item" data-session-id="${session.session_id}">
              <div class="session-preview">${session.preview}</div>
              <div class="session-meta">
                <span class="session-date">${formatDate(session.updated_at)}</span>
                <span>${session.message_count} tin nhắn</span>
              </div>
            </div>
          `;
        }).join('');

        // Thêm event listeners cho session items
        container.querySelectorAll('.session-item').forEach(function(item) {
          item.addEventListener('click', function() {
            var sessionId = item.dataset.sessionId;
            loadSession(sessionId);
          });
        });
      }
      
      // Function để load session cụ thể
      function loadSession(sessionId) {
        fetch(`/api/chat/history?user_id=${userId}&session_id=${sessionId}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.success && data.data.length > 0) {
              var messages = data.data[0].messages;
              // Clear current messages
              msgs.innerHTML = '';
              history = [];
              
              // Load lại tất cả tin nhắn
              messages.forEach(function(msg) {
                var msgDiv = document.createElement("div");
                msgDiv.className = "hnv-msg hnv-msg--" + (msg.role === "user" ? "me" : "bot");
                msgDiv.textContent = msg.content;
                msgs.appendChild(msgDiv);
                
                // Thêm vào history
                history.push({ role: msg.role, content: msg.content });
              });
              
              // Scroll xuống cuối
              msgs.scrollTop = msgs.scrollHeight;
              
              // Cập nhật session hiện tại
              sessionId = sessionId;
              localStorage.setItem('chat_session_id', sessionId);
              
              // Đóng sidebar
              document.getElementById('chat-history-sidebar').classList.remove('open');
            }
          })
          .catch(function(error) {
            console.error('Error loading session:', error);
          });
      }
      
      // Function để format date
      function formatDate(dateString) {
        var date = new Date(dateString);
        var now = new Date();
        var diffTime = Math.abs(now - date);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          return 'Hôm nay';
        } else if (diffDays === 2) {
          return 'Hôm qua';
        } else if (diffDays <= 7) {
          return (diffDays - 1) + ' ngày trước';
        } else {
          return date.toLocaleDateString('vi-VN');
        }
      }
      
      if (send)
        send.addEventListener("click", function (e) {
          e.preventDefault();
          echo();
        });
      
      if (newChatBtn)
        newChatBtn.addEventListener("click", function (e) {
          e.preventDefault();
          startNewChat();
        });
      
      if (historyBtn)
        historyBtn.addEventListener("click", function (e) {
          e.preventDefault();
          showChatHistory();
        });
      
      if (closeBtn)
        closeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          panel.style.display = "none";
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
