const TransportationPage = require('../../model/TransportationPage');

// Ensure a singleton doc exists
async function getOrCreatePage() {
  let page = await TransportationPage.findOne({}).sort({ updatedAt: -1 });
  if (!page) {
    page = new TransportationPage({});
    await page.save();
  }
  return page;
}

// [GET] /admin/transportation-page
module.exports.edit = async (req, res) => {
  try {
    const page = await getOrCreatePage();
    res.render('admin/layout', {
      pageTitle: 'Nội dung trang Di chuyển',
      page: 'transportations',
      body: 'admin/pages/transportations/page',
      user: req.user,
      pageData: page
    });
  } catch (error) {
    console.error('TransportationPage edit error:', error);
    req.flash('error', 'Không tải được nội dung trang');
    res.redirect('/admin/dashboard');
  }
};

// [POST] /admin/transportation-page
module.exports.update = async (req, res) => {
  try {
    const data = req.body;
    const page = await getOrCreatePage();

    // Normalize collections
    const normalizeArray = (v) => Array.isArray(v) ? v.filter(x => x && String(x).trim() !== '') : (v ? [v] : []);

    // apps (icon[], name[], desc[])
    if (data.apps) {
      const icons = normalizeArray(data.apps.icon);
      const names = normalizeArray(data.apps.name);
      const descs = normalizeArray(data.apps.desc);
      const len = Math.max(icons.length, names.length, descs.length);
      data.apps = Array.from({ length: len }).map((_, i) => ({ icon: icons[i] || '', name: names[i] || '', desc: descs[i] || '' })).filter(a => a.name);
    }

    // comparisons (label[], icon[], price[], wait[], fit[])
    if (data.comparisons) {
      const labels = normalizeArray(data.comparisons.label);
      const icons = normalizeArray(data.comparisons.icon);
      const prices = normalizeArray(data.comparisons.price);
      const waits = normalizeArray(data.comparisons.wait);
      const fits = normalizeArray(data.comparisons.fit);
      const len = Math.max(labels.length, icons.length, prices.length, waits.length, fits.length);
      data.comparisons = Array.from({ length: len }).map((_, i) => ({
        label: labels[i] || '', icon: icons[i] || '', price: prices[i] || '', wait: waits[i] || '', fit: fits[i] || ''
      })).filter(c => c.label);
    }

    // tips (icon[], title[], desc[])
    if (data.tips) {
      const icons = normalizeArray(data.tips.icon);
      const titles = normalizeArray(data.tips.title);
      const descs = normalizeArray(data.tips.desc);
      const len = Math.max(icons.length, titles.length, descs.length);
      data.tips = Array.from({ length: len }).map((_, i) => ({ icon: icons[i] || '', title: titles[i] || '', desc: descs[i] || '' })).filter(t => t.title);
    }

    // Assign nested structures safely
    const assignIf = (obj, path, value) => {
      if (value === undefined) return;
      const parts = path.split('.');
      let ref = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!ref[parts[i]]) ref[parts[i]] = {};
        ref = ref[parts[i]];
      }
      ref[parts[parts.length - 1]] = value;
    };

    assignIf(page, 'hero.title', data.hero?.title);
    assignIf(page, 'hero.subtitle', data.hero?.subtitle);
    assignIf(page, 'hero.bannerImage', data.hero?.bannerImage);
    assignIf(page, 'arrivalTitle', data.arrivalTitle);
    assignIf(page, 'arrivalSubtitle', data.arrivalSubtitle);
    assignIf(page, 'localTitle', data.localTitle);
    assignIf(page, 'localSubtitle', data.localSubtitle);
    assignIf(page, 'appsTitle', data.appsTitle);
    assignIf(page, 'appsSubtitle', data.appsSubtitle);
    assignIf(page, 'compareTitle', data.compareTitle);
    assignIf(page, 'tipsTitle', data.tipsTitle);
    if (data.apps) page.apps = data.apps;
    if (data.comparisons) page.comparisons = data.comparisons;
    if (data.tips) page.tips = data.tips;

    await page.save();
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, message: 'Đã lưu nội dung trang', data: page });
    }
    req.flash('success', 'Đã lưu nội dung trang');
    return res.redirect('/admin/transportation-page');
  } catch (error) {
    console.error('TransportationPage update error:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'Lỗi khi lưu nội dung', error: error.message });
    }
    req.flash('error', 'Lỗi khi lưu nội dung: ' + error.message);
    return res.redirect('/admin/transportation-page');
  }
};


