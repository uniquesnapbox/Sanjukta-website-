(function() {
    var root = document.getElementById('productGalleryRoot');
    if (!root || !window.PRODUCT_GALLERY_DATA || !window.PRODUCT_GALLERY_DATA.length) return;

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    root.innerHTML = window.PRODUCT_GALLERY_DATA.map(function(group, groupIndex) {
        var photos = (group.photos || []).map(function(src, index) {
            var caption = group.name + ' photo ' + (index + 1);
            var delay = (index % 6) * 35;
            return '' +
                '<a class="photo-card" href="' + src + '" target="_blank" rel="noopener" data-aos="zoom-in" data-aos-delay="' + delay + '">' +
                   '<img loading="lazy" src="' + src + '" alt="' + escapeHtml(caption) + '"/>' +
                   '<span class="photo-caption">' + escapeHtml(caption) + '</span>' +
                '</a>';
        }).join('');

        return '' +
            '<div class="photo-group" data-c="' + escapeHtml(group.category || 'all') + '" data-aos="fade-up" data-aos-delay="' + (groupIndex % 4) * 70 + '">' +
               '<div class="photo-group-head">' +
                  '<div>' +
                     '<div class="photo-kicker">' + escapeHtml(group.categoryLabel || 'Product') + '</div>' +
                     '<h3>' + escapeHtml(group.name) + '</h3>' +
                  '</div>' +
                  '<div class="photo-count">' + (group.photos || []).length + ' photos</div>' +
               '</div>' +
               '<div class="photo-grid">' + photos + '</div>' +
            '</div>';
    }).join('');

    if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        setTimeout(function() {
            window.AOS.refreshHard();
        }, 50);
    }
})();
