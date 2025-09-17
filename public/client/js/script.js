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

        // Mount lightweight chatbot
        (function initChatbot(){
            var root = document.getElementById('hnv-chatbot-root');
            if (!root) return;
            root.innerHTML = '';
            var wrap = document.createElement('div');
            wrap.className = 'hnv-chat';
            wrap.innerHTML = '\n                <button class="hnv-chat__toggle" aria-label="Chat"><i class="fa fa-comments"></i></button>\n                <div class="hnv-chat__panel" role="dialog" aria-label="Chatbot">\n                    <div class="hnv-chat__header">Hà Nội Vibes - Trợ lý du lịch</div>\n                    <div class="hnv-chat__body">\n                        <div id="layout" order_random="true">\n                            <div id="text1_wrapper"><div id="text1" class="hnv-chip">Gợi ý lịch trình 2 ngày?</div></div>\n                            <div id="text2_wrapper"><div id="text2" class="hnv-chip">Ăn gì ở Phố cổ?</div></div>\n                            <div id="text3_wrapper"><div id="text3" class="hnv-chip">Phương tiện di chuyển?</div></div>\n                            <div id="text4_wrapper"><div id="text4"> <a href=\"https://www.elsewhere.io/letter-from-our-founders\" target=\"_blank\" class=\"hnv-link\">Letter from Our Founders</a> <br> <a href=\"https://www.elsewhere.io/contact-us\" target=\"_blank\" class=\"hnv-link\">Contact Us</a></div></div>\n                            <div id="text5_wrapper"><div id="text5" class="hnv-chip">Top điểm check-in</div></div>\n                            <div id="text6_wrapper"><div id="text6">Same boundary-pushing trips. <br>Same unforgettable experiences.</div></div>\n                        </div>\n                        <div class=\"hnv-chat__messages\" id=\"hnvMsgs\">\n                            <div class=\"hnv-msg hnv-msg--bot\">Xin chào! Bạn muốn đi đâu ở Hà Nội?</div>\n                        </div>\n                    </div>\n                    <div class=\"hnv-chat__footer\">\n                        <input class=\"hnv-input\" id=\"hnvInput\" type=\"text\" placeholder=\"Nhập câu hỏi của bạn...\" />\n                        <button class=\"hnv-send\" id=\"hnvSend\" aria-label=\"Gửi\"><i class=\"fa fa-paper-plane\"></i></button>\n                    </div>\n                </div>';
            root.appendChild(wrap);

            var toggle = wrap.querySelector('.hnv-chat__toggle');
            var panel = wrap.querySelector('.hnv-chat__panel');
            if (toggle && panel) {
                toggle.addEventListener('click', function(){
                    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                });
            }

            // simple local echo for input
            var input = wrap.querySelector('#hnvInput');
            var send = wrap.querySelector('#hnvSend');
            var msgs = wrap.querySelector('#hnvMsgs');
            function echo(){
                if (!input || !msgs) return;
                var v = (input.value||'').trim();
                if (!v) return;
                var me = document.createElement('div');
                me.className = 'hnv-msg hnv-msg--me';
                me.textContent = v;
                msgs.appendChild(me);
                input.value='';
                var bot = document.createElement('div');
                bot.className = 'hnv-msg hnv-msg--bot';
                bot.textContent = 'Cảm ơn! Chúng tôi sẽ gợi ý dựa trên: ' + v;
                msgs.appendChild(bot);
                msgs.scrollTop = msgs.scrollHeight;
            }
            if (send) send.addEventListener('click', function(e){ e.preventDefault(); echo(); });
            if (input) input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); echo(); }});
        })();
    }

    document.addEventListener("partials:loaded", initUI);

    if (document.readyState === "complete" || document.readyState === "interactive") {
        // If partials aren't used on this page, still initialize after DOM is ready
        if (document.querySelector(".navbar")) initUI();
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            if (document.querySelector(".navbar")) initUI();
        });
    }
})();
