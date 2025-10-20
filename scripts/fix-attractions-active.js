// Script để set isActive=true cho tất cả attractions tu-nhien
require('dotenv').config();
const mongoose = require('mongoose');
const Attraction = require('../model/Attraction');

async function fixAttractions() {
    try {
        // Kết nối database
        if (!process.env.MONGO_URL) {
            console.error('❌ MONGO_URL not found in .env file');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to database');

        // Kiểm tra trước khi fix
        const tuNhienInactive = await Attraction.countDocuments({ 
            category: 'tu-nhien', 
            isActive: { $ne: true } 
        });
        
        console.log(`\n📊 Found ${tuNhienInactive} tu-nhien attractions that are not active`);

        if (tuNhienInactive === 0) {
            console.log('✅ All tu-nhien attractions are already active!');
            await mongoose.connection.close();
            return;
        }

        // Fix: Set tất cả tu-nhien attractions thành active
        const result = await Attraction.updateMany(
            { category: 'tu-nhien' },
            { $set: { isActive: true } }
        );

        console.log(`\n✅ Updated ${result.modifiedCount} attractions`);

        // Verify
        const tuNhienActive = await Attraction.countDocuments({ 
            category: 'tu-nhien', 
            isActive: true 
        });
        console.log(`✅ Now ${tuNhienActive} tu-nhien attractions are active`);

        // List them
        const attractions = await Attraction.find({ category: 'tu-nhien' })
            .select('name isActive')
            .lean();
        console.log(`\n🌿 Tu-nhien attractions:`);
        attractions.forEach((attr, index) => {
            console.log(`  ${index + 1}. ${attr.name} (isActive: ${attr.isActive})`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Done! Please restart your server.');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixAttractions();

