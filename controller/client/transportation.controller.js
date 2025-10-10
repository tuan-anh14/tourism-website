const Transportation = require('../../model/Transportation');
const TransportationPage = require('../../model/TransportationPage');

module.exports.transportation = async (req, res) => {
    try {
        // Page meta (single doc)
        let page = await TransportationPage.findOne({}).sort({ updatedAt: -1 });
        if (!page) page = new TransportationPage({});

        // Arrival: category den-ha-noi
        const arrivalDocs = await Transportation.find({ isActive: true, category: 'den-ha-noi' }).sort({ featured: -1, createdAt: -1 });
        const arrivalTransports = arrivalDocs.map(d => ({
            icon: d.icon || 'fa-circle',
            title: d.name,
            desc: d.description
        }));

        // Local: category trong-ha-noi
        const localDocs = await Transportation.find({ isActive: true, category: 'trong-ha-noi' }).sort({ featured: -1, createdAt: -1 });
        const localTransports = localDocs.map(d => ({
            icon: d.icon || 'fa-circle',
            title: d.name,
            desc: d.description,
            tags: d.tags || []
        }));

        res.render('client/pages/transportation/transportation.ejs', {
            pageTitle: 'Di chuyển',
            hero: page.hero,
            arrivalTransports,
            localTransports,
            apps: page.apps || [],
            comparisons: page.comparisons || [],
            tips: page.tips || []
        });
    } catch (error) {
        console.error('Client transportation error:', error);
        res.render('client/pages/transportation/transportation.ejs', {
            pageTitle: 'Di chuyển',
            hero: { title: 'Hướng dẫn di chuyển', subtitle: 'Khám phá Hà Nội một cách dễ dàng và thuận tiện', bannerImage: '/client/img/header-bg.jfif' },
            arrivalTransports: [],
            localTransports: [],
            apps: [],
            comparisons: [],
            tips: []
        });
    }
}
