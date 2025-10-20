// Script kiểm tra và sửa attractions trong database
require('dotenv').config();
const mongoose = require('mongoose');
const Attraction = require('../model/Attraction');

async function checkAttractions() {
    try {
        // Kết nối database
        if (!process.env.MONGO_URL) {
            console.error('❌ MONGO_URL not found in .env file');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to database');

        // Đếm tổng số attractions
        const total = await Attraction.countDocuments({});
        console.log(`\n📊 Total attractions: ${total}`);

        // Đếm theo isActive
        const active = await Attraction.countDocuments({ isActive: true });
        const inactive = await Attraction.countDocuments({ isActive: false });
        console.log(`✅ Active: ${active}`);
        console.log(`❌ Inactive: ${inactive}`);

        // Đếm theo category
        const nhanVanTotal = await Attraction.countDocuments({ category: 'nhan-van' });
        const tuNhienTotal = await Attraction.countDocuments({ category: 'tu-nhien' });
        console.log(`\n📁 Category breakdown:`);
        console.log(`  - nhan-van: ${nhanVanTotal}`);
        console.log(`  - tu-nhien: ${tuNhienTotal}`);

        // Đếm theo category + isActive
        const nhanVanActive = await Attraction.countDocuments({ category: 'nhan-van', isActive: true });
        const tuNhienActive = await Attraction.countDocuments({ category: 'tu-nhien', isActive: true });
        console.log(`\n✅ Active by category:`);
        console.log(`  - nhan-van (active): ${nhanVanActive}`);
        console.log(`  - tu-nhien (active): ${tuNhienActive}`);

        // Liệt kê các attractions tu-nhien
        console.log(`\n🌿 Tu-nhien attractions:`);
        const tuNhienAttractions = await Attraction.find({ category: 'tu-nhien' })
            .select('name category isActive featured createdAt')
            .lean();
        tuNhienAttractions.forEach((attr, index) => {
            console.log(`  ${index + 1}. ${attr.name}`);
            console.log(`     - isActive: ${attr.isActive}`);
            console.log(`     - featured: ${attr.featured}`);
            console.log(`     - createdAt: ${attr.createdAt}`);
        });

        // Liệt kê 5 attractions nhan-van đầu tiên
        console.log(`\n🏛️ First 5 nhan-van attractions:`);
        const nhanVanAttractions = await Attraction.find({ category: 'nhan-van' })
            .select('name category isActive featured createdAt')
            .limit(5)
            .lean();
        nhanVanAttractions.forEach((attr, index) => {
            console.log(`  ${index + 1}. ${attr.name}`);
            console.log(`     - isActive: ${attr.isActive}`);
            console.log(`     - featured: ${attr.featured}`);
            console.log(`     - createdAt: ${attr.createdAt}`);
        });

        // Kiểm tra xem có attractions nào bị lỗi category không
        const invalidCategories = await Attraction.find({
            category: { $nin: ['nhan-van', 'tu-nhien'] }
        }).select('name category').lean();
        if (invalidCategories.length > 0) {
            console.log(`\n⚠️ Attractions with invalid categories:`);
            invalidCategories.forEach(attr => {
                console.log(`  - ${attr.name}: ${attr.category}`);
            });
        }

        // Đề xuất fix
        if (tuNhienActive === 0 && tuNhienTotal > 0) {
            console.log(`\n⚠️ WARNING: Có ${tuNhienTotal} attractions tu-nhien nhưng KHÔNG có cái nào active!`);
            console.log(`\n💡 Để fix, chạy lệnh sau:`);
            console.log(`   node scripts/fix-attractions-active.js`);
        }

        await mongoose.connection.close();
        console.log('\n✅ Done');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAttractions();

