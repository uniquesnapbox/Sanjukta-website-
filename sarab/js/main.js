AOS.init({
    duration: 680,
    once: true,
    offset: 55
});

/* NAVBAR SCROLL & ACTIVE LINK  */
window.addEventListener('scroll', function() {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('btt').classList.toggle('show', window.scrollY > 300);
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/*  SMOOTH SCROLL + MOBILE NAV CLOSE  */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            // Close Bootstrap mobile navbar if open
            var navCollapse = document.getElementById('navmenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            // Scroll after slight delay to let navbar close
            setTimeout(function() {
                window.scrollTo({
                    top: t.offsetTop - 78,
                    behavior: 'smooth'
                });
            }, 50);
        }
    });
});


var searchOv = document.getElementById('searchOv');
var navSearchBtn = document.getElementById('navSearchBtn');
var searchCloseBtn = document.getElementById('searchClose');
var searchInput = document.getElementById('searchInput');

if (searchOv && navSearchBtn && searchCloseBtn && searchInput) {
    navSearchBtn.addEventListener('click', function() {
        searchOv.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(function() {
            searchInput.focus();
        }, 220);
    });

    searchCloseBtn.addEventListener('click', closeSearch);

    // Close when clicking backdrop
    searchOv.addEventListener('click', function(e) {
        if (e.target === searchOv) closeSearch();
    });

    // Category buttons inside search box
    document.querySelectorAll('.sovcat').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sovcat').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            var f = this.getAttribute('data-cat');
            closeSearch();
            setTimeout(function() {
                filterMenu(f);
                var menuSection = document.getElementById('menu');
                if (menuSection) {
                    menuSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    });

    // Trending tags fill the search input
    document.querySelectorAll('.sovtrend .ttag').forEach(function(t) {
        t.addEventListener('click', function() {
            searchInput.value = this.textContent.trim();
            searchInput.focus();
        });
    });
}

function closeSearch() {
    if (!searchOv) return;
    searchOv.classList.remove('open');
    document.body.style.overflow = '';
}


$(document).ready(function() {
	$('.magnific_popup').magnificPopup({
	  disableOn: 700,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  fixedContentPos: false,
	  disableOn: 300
	});	
});


function filterMenu(cat) {
    // sync filter buttons
    document.querySelectorAll('.filtbtn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-f') === cat);
    });
    // sync category cards
    document.querySelectorAll('.catcard').forEach(function(c) {
        c.classList.toggle('active', c.getAttribute('data-filter') === cat);
    });
    // show/hide menu cards
    document.querySelectorAll('.mwrap').forEach(function(w) {
        var c = w.getAttribute('data-c');
        if (cat === 'all' || c === cat) {
            w.classList.remove('gone');
            w.style.opacity = '0';
            w.style.transform = 'translateY(16px)';
            setTimeout(function() {
                w.style.transition = 'opacity .38s,transform .38s';
                w.style.opacity = '1';
                w.style.transform = 'translateY(0)';
            }, 60);
        } else {
            w.classList.add('gone');
        }
    });
    // show/hide photo gallery groups
    document.querySelectorAll('.photo-group').forEach(function(g) {
        var c = g.getAttribute('data-c');
        if (cat === 'all' || c === cat) {
            g.classList.remove('gone');
        } else {
            g.classList.add('gone');
        }
    });
}

// Filter buttons
document.querySelectorAll('.filtbtn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterMenu(this.getAttribute('data-f'));
    });
});

// Category section cards â†’ scroll + filter
document.querySelectorAll('.catcard').forEach(function(card) {
    card.addEventListener('click', function() {
        var f = this.getAttribute('data-filter');
        window.scrollTo({
            top: document.getElementById('menu').offsetTop - 80,
            behavior: 'smooth'
        });
        setTimeout(function() {
            filterMenu(f);
        }, 480);
    });
});


var menuPop = document.getElementById('menuPop');
var mpQty = 1;
var mpThumbs = document.getElementById('mpThumbs');
var mpGalleryWrap = document.querySelector('.mpgallery');
var mpCurrentGallery = [];

function normalizeGalleryKey(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
}

function setMenuMainImage(src) {
    var mpImg = document.getElementById('mpImg');
    if (mpImg && src) {
        mpImg.setAttribute('src', src);
    }
}

function getProductGallery(card, fallbackImg) {
    var galleryAttr = card && card.getAttribute('data-gallery');
    if (galleryAttr) {
        return galleryAttr.split(',').map(function(src) {
            return src.trim();
        }).filter(Boolean);
    }

    var titleKey = normalizeGalleryKey(card && card.getAttribute('data-title'));
    var folderMap = {
        'namkeen': 'Namkeen Mix',
        'chanachur': 'Namkeen Mix',
        'jhal bhujiya': 'Namkeen Mix',
        'tikha mixture': 'Namkeen Mix',
        'khatta meetha mixture': 'Namkeen Mix',
        'navratna mixture': 'Namkeen Mix',
        'chira bhaja': 'Chira Bhaja',
        'chira bhaja mix': 'Chira Bhaja'
    };
    var folderName = folderMap[titleKey];
    var groups = window.PRODUCT_GALLERY_DATA || [];
    var group = null;

    if (folderName) {
        var folderKey = normalizeGalleryKey(folderName);
        group = groups.find(function(item) {
            return normalizeGalleryKey(item.name) === folderKey;
        });
    }

    if (!group) {
        group = groups.find(function(item) {
            return normalizeGalleryKey(item.name) === titleKey;
        });
    }

    var photos = group && Array.isArray(group.photos) ? group.photos.filter(Boolean) : [];
    if (!photos.length && fallbackImg) {
        photos = [fallbackImg];
    }
    return photos;
}

function renderMenuGallery(photos) {
    if (!mpThumbs || !mpGalleryWrap) return;

    mpThumbs.innerHTML = '';
    if (!photos || photos.length <= 1) {
        mpGalleryWrap.style.display = 'none';
        return;
    }

    mpGalleryWrap.style.display = 'block';
    photos.forEach(function(src, index) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mpthumb' + (index === 0 ? ' active' : '');
        btn.setAttribute('data-src', src);

        var img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', 'Product photo ' + (index + 1));

        btn.appendChild(img);
        mpThumbs.appendChild(btn);
    });
}

function openMenuPop(card) {
    if (!menuPop || !card) return;
    var img = card.getAttribute('data-img');
    var title = card.getAttribute('data-title');
    var cat = card.getAttribute('data-cat');
    var price = card.getAttribute('data-price');
    var old = card.getAttribute('data-old');
    var rating = parseFloat(card.getAttribute('data-rating'));
    var reviews = card.getAttribute('data-reviews');
    var cal = card.getAttribute('data-cal');
    var time = card.getAttribute('data-time');
    var desc = card.getAttribute('data-desc');
    var tags = card.getAttribute('data-tags') || '';
    var gallery = getProductGallery(card, img);

    mpCurrentGallery = gallery;
    setMenuMainImage(gallery[0] || img);
    renderMenuGallery(gallery);
    document.getElementById('mpCat').textContent = cat;
    document.getElementById('mpTitle').textContent = title;

    var full = Math.round(rating),
        empty = 5 - full;
    document.getElementById('mpStars').innerHTML =
        '<i class="fas fa-star"></i>'.repeat(full) + 'â˜†'.repeat(empty) +
        ' <span style="color:#bbb;font-size:.78rem;">' + rating + ' (' + reviews + ' reviews)</span>';

    document.getElementById('mpDesc').textContent = desc;

    document.getElementById('mpPrice').innerHTML =
        price + (old ? '<small style="color:#ccc;text-decoration:line-through;margin-left:8px;font-size:1rem;">' + old + '</small>' : '');

    document.getElementById('mpMeta').innerHTML =
        '<div class="mpm"><div class="mpmv">' + cal + ' kcal</div><div class="mpml">Calories</div></div>' +
        '<div class="mpm"><div class="mpmv">' + time + ' min</div><div class="mpml">Prep Time</div></div>' +
        '<div class="mpm"><div class="mpmv">' + rating + '/5</div><div class="mpml">Rating</div></div>';

    document.getElementById('mpTags').innerHTML =
        tags.split(',').filter(Boolean).map(function(t) {
            return '<span class="mptag">' + t.trim() + '</span>';
        }).join('');

    mpQty = 1;
    document.getElementById('mpQnum').textContent = 1;
    document.getElementById('mpAddCart').innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    document.getElementById('mpAddCart').style.background = '';

    menuPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMenuPop() {
    if (!menuPop) return;
    menuPop.classList.remove('open');
    document.body.style.overflow = '';
}

if (menuPop) {
    if (mpThumbs) {
        mpThumbs.addEventListener('click', function(e) {
            var btn = e.target.closest('.mpthumb');
            if (!btn) return;
            var src = btn.getAttribute('data-src');
            if (!src) return;
            setMenuMainImage(src);
            mpThumbs.querySelectorAll('.mpthumb').forEach(function(t) {
                t.classList.toggle('active', t === btn);
            });
        });
    }

    // Card click open popup
    document.querySelectorAll('.mcard').forEach(function(card) {
        card.addEventListener('click', function() {
            openMenuPop(this);
        });
    });

    // + button open popup (stop propagation to avoid double firing)
    document.querySelectorAll('.madd').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openMenuPop(this.closest('.mcard'));
        });
    });

    // Heart toggle (no popup)
    document.querySelectorAll('.mhrt').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var ico = this.querySelector('i');
            ico.classList.toggle('far');
            ico.classList.toggle('fas');
            this.style.color = ico.classList.contains('fas') ? 'var(--primary)' : '#ccc';
        });
    });

    var mpClose = document.getElementById('mpClose');
    var mpPlus = document.getElementById('mpPlus');
    var mpMinus = document.getElementById('mpMinus');
    var mpAddCart = document.getElementById('mpAddCart');
    var mpQnum = document.getElementById('mpQnum');
    var cartCount = document.getElementById('cartCount');

    if (mpClose) mpClose.addEventListener('click', closeMenuPop);
    menuPop.addEventListener('click', function(e) {
        if (e.target === this) closeMenuPop();
    });

    if (mpPlus && mpQnum) {
        mpPlus.addEventListener('click', function() {
            mpQnum.textContent = ++mpQty;
        });
    }
    if (mpMinus && mpQnum) {
        mpMinus.addEventListener('click', function() {
            if (mpQty > 1) mpQnum.textContent = --mpQty;
        });
    }

    if (mpAddCart && cartCount && mpQnum) {
        mpAddCart.addEventListener('click', function() {
            var cnt = parseInt(cartCount.textContent) + mpQty;
            cartCount.textContent = cnt;
            this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
            this.style.background = 'linear-gradient(135deg,var(--green),#1a4a35)';
            var self = this;
            setTimeout(function() {
                closeMenuPop();
                self.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                self.style.background = '';
            }, 1000);
        });
    }
}


var resBtn = document.getElementById('resBtn');
if (resBtn) {
    resBtn.addEventListener('click', function() {
        var btn = this;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        btn.disabled = true;
        setTimeout(function() {
            btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
            btn.disabled = false;
            var ok = document.getElementById('resOk');
            if (ok) {
                ok.style.display = 'block';
                ok.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 1500);
    });
}


var ctcBtn = document.getElementById('ctcBtn');
if (ctcBtn) {
    ctcBtn.addEventListener('click', function() {
        var btn = this;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(function() {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.disabled = false;
            var ok = document.getElementById('ctcOk');
            if (ok) {
                ok.style.display = 'block';
                ok.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 1500);
    });
}


var careerBtn = document.getElementById('careerBtn');
if (careerBtn) {
    careerBtn.addEventListener('click', function() {
        var btn = this;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
        btn.disabled = true;
        setTimeout(function() {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Apply Now';
            btn.disabled = false;
            var ok = document.getElementById('careerOk');
            if (ok) {
                ok.style.display = 'block';
                ok.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 1500);
    });
}


var galPop = document.getElementById('galPop');
var galData = [];
var galIdx = 0;

if (galPop) {
    document.querySelectorAll('.gitem').forEach(function(item) {
        galData.push({
            img: item.getAttribute('data-gimg'),
            title: item.getAttribute('data-gtitle'),
            desc: item.getAttribute('data-gdesc')
        });
        item.addEventListener('click', function() {
            openGal(parseInt(this.getAttribute('data-gi')));
        });
    });

    function openGal(i) {
        galIdx = i;
        var g = galData[i];
        var gpImg = document.getElementById('gpImg');
        var gpTitle = document.getElementById('gpTitle');
        var gpDesc = document.getElementById('gpDesc');
        if (!g || !gpImg || !gpTitle || !gpDesc) return;
        gpImg.setAttribute('src', g.img);
        gpTitle.textContent = g.title;
        gpDesc.innerHTML = g.desc;
        galPop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    var gpClose = document.getElementById('gpClose');
    var gpPrev = document.getElementById('gpPrev');
    var gpNext = document.getElementById('gpNext');
    if (gpClose) gpClose.addEventListener('click', closeGal);
    galPop.addEventListener('click', function(e) {
        if (e.target === this) closeGal();
    });

    function closeGal() {
        galPop.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (gpPrev) {
        gpPrev.addEventListener('click', function() {
            openGal((galIdx - 1 + galData.length) % galData.length);
        });
    }
    if (gpNext) {
        gpNext.addEventListener('click', function() {
            openGal((galIdx + 1) % galData.length);
        });
    }
} else {
    function closeGal() {}
}

/*  ESC key closes everything */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeMenuPop();
        closeGal();
        if (typeof $.magnificPopup !== 'undefined') $.magnificPopup.close();
    }
});


new Swiper('.tesSwiper', {
    slidesPerView: 1,
    spaceBetween: 22,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    breakpoints: {
        640: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});


var cdH = document.getElementById('cdH');
var cdM = document.getElementById('cdM');
var cdS = document.getElementById('cdS');
if (cdH && cdM && cdS) {
    var cH = 8,
        cM = 45,
        cS = 30;
    setInterval(function() {
        cS--;
        if (cS < 0) {
            cS = 59;
            cM--;
        }
        if (cM < 0) {
            cM = 59;
            cH--;
        }
        if (cH < 0) {
            cH = 8;
            cM = 45;
            cS = 30;
        }
        cdH.textContent = String(cH).padStart(2, '0');
        cdM.textContent = String(cM).padStart(2, '0');
        cdS.textContent = String(cS).padStart(2, '0');
    }, 1000);
}

/* â”€â”€ NEWSLETTER â”€â”€ */
var nlBtn = document.getElementById('nlBtn');
var nlEmail = document.getElementById('nlEmail');
if (nlBtn && nlEmail) {
    nlBtn.addEventListener('click', function() {
        var email = nlEmail.value;
        if (email && email.includes('@')) {
            var btn = this;
            btn.textContent = 'Subscribed!';
            btn.style.background = '#4ade80';
            btn.style.color = '#222';
            nlEmail.value = '';
            setTimeout(function() {
                btn.textContent = 'Subscribe';
                btn.style.background = '';
                btn.style.color = '';
            }, 3000);
        }
    });
}

/*  NUMBER COUNTER ANIMATION*/
var numAnimated = false;
window.addEventListener('scroll', function() {
    var hero = document.getElementById('hero');
    if (!numAnimated && hero && window.scrollY > hero.offsetHeight - 300) {
        numAnimated = true;
        document.querySelectorAll('.snum').forEach(function(el) {
            var txt = el.textContent;
            var num = parseInt(txt);
            var suf = txt.replace(/[0-9]/g, '');
            if (isNaN(num)) return;
            var start = 0;
            var step = Math.ceil(num / 55);
            var iv = setInterval(function() {
                start += step;
                if (start >= num) {
                    start = num;
                    clearInterval(iv);
                }
                el.textContent = start + suf;
            }, 1400 / 55);
        });
    }
});

