const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../model/User');
const Attraction = require('../model/Attraction');
const Accommodation = require('../model/Accommodation');
const Food = require('../model/Food');
const Entertainment = require('../model/Entertainment');
const Tour = require('../model/Tour');
const News = require('../model/News');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@hanoitourism.com',
    password: 'admin123',
    fullName: 'Administrator',
    role: 'admin'
  },
  {
    username: 'editor',
    email: 'editor@hanoitourism.com',
    password: 'editor123',
    fullName: 'Content Editor',
    role: 'editor'
  }
];

const sampleAttractions = [
  {
    name: 'Văn Miếu – Quốc Tử Giám',
    nameEn: 'Temple of Literature',
    category: 'di-tich-lich-su',
    location: {
      address: '58 P. Quốc Tử Giám, Văn Miếu – Quốc Tử Giám, Đống Đa, Hà Nội',
      district: 'Đống Đa',
      coordinates: {
        lat: 21.0278,
        lng: 105.8342
      }
    },
    openingHours: {
      summer: {
        open: '7:30',
        close: '18:00'
      },
      winter: {
        open: '8:00',
        close: '18:00'
      }
    },
    ticketPrices: {
      adult: 70000,
      student: 15000,
      elderly: 35000,
      child: 0,
      note: 'Trẻ em dưới 15 tuổi miễn phí'
    },
    description: 'Văn Miếu – Quốc Tử Giám là quần thể di tích lịch sử, văn hóa nổi tiếng nằm ở trung tâm Hà Nội, được xây dựng từ năm 1070 dưới triều Lý. Đây là trường đại học đầu tiên của Việt Nam.',
    descriptionEn: 'Temple of Literature is a famous historical and cultural relic complex located in the center of Hanoi, built in 1070 under the Ly dynasty. This is the first university of Vietnam.',
    history: 'Văn Miếu được xây dựng năm 1070 dưới thời vua Lý Thánh Tông để thờ Khổng Tử và các bậc hiền triết. Năm 1076, Quốc Tử Giám được thành lập bên cạnh Văn Miếu.',
    experiences: [
      'Chiêm ngưỡng kiến trúc cổ kính từ Khuê Văn Các',
      'Tìm hiểu lịch sử giáo dục Việt Nam',
      'Chụp ảnh với bia Tiến sĩ trên lưng rùa'
    ],
    experiencesEn: [
      'Admire ancient architecture from Khuê Văn Các',
      'Learn about Vietnamese education history',
      'Take photos with stone steles on turtle backs'
    ],
    notes: [
      'Chấp hành đúng quy định của đơn vị quản lý',
      'Không được xâm hại đến hiện vật và cảnh quan'
    ],
    images: [
      {
        url: '/client/img/van-mieu.jpg',
        alt: 'Văn Miếu Quốc Tử Giám',
        isMain: true
      }
    ],
    rating: {
      average: 4.5,
      count: 1250
    },
    isActive: true,
    featured: true,
    tags: ['di-tich', 'lich-su', 'van-hoa', 'giao-duc']
  },
  {
    name: 'Hoàng Thành Thăng Long',
    nameEn: 'Thang Long Imperial Citadel',
    category: 'di-tich-lich-su',
    location: {
      address: 'Số 19C Hoàng Diệu, Điện Biên, quận Ba Đình, Hà Nội',
      district: 'Ba Đình',
      coordinates: {
        lat: 21.0333,
        lng: 105.8333
      }
    },
    openingHours: {
      summer: {
        open: '8:00',
        close: '17:00'
      },
      winter: {
        open: '8:00',
        close: '17:00'
      }
    },
    ticketPrices: {
      adult: 100000,
      student: 50000,
      elderly: 50000,
      child: 0,
      note: 'Trẻ em dưới 15 tuổi miễn phí'
    },
    description: 'Hoàng thành Thăng Long là Di sản Văn hóa Thế giới được UNESCO công nhận, là trung tâm quyền lực của Việt Nam trong hơn 1000 năm.',
    descriptionEn: 'Thang Long Imperial Citadel is a UNESCO World Cultural Heritage site, the center of Vietnamese power for over 1000 years.',
    history: 'Hoàng thành được xây dựng từ thế kỷ 7 dưới thời nhà Đường, sau đó được các triều đại Việt Nam kế tiếp sử dụng và mở rộng.',
    experiences: [
      'Chụp ảnh với cổ phục/ áo dài',
      'Tham quan các di tích khảo cổ',
      'Tìm hiểu lịch sử các triều đại Việt Nam'
    ],
    experiencesEn: [
      'Take photos in traditional costumes/ ao dai',
      'Visit archaeological relics',
      'Learn about Vietnamese dynasties history'
    ],
    notes: [
      'Ăn mặc lịch sự khi tham quan',
      'Tuân thủ hướng dẫn của hướng dẫn viên'
    ],
    images: [
      {
        url: '/client/img/hoang-thanh.jpg',
        alt: 'Hoàng Thành Thăng Long',
        isMain: true
      }
    ],
    rating: {
      average: 4.3,
      count: 980
    },
    isActive: true,
    featured: true,
    tags: ['di-tich', 'lich-su', 'unesco', 'hoang-thanh']
  }
];

const sampleAccommodations = [
  {
    name: 'InterContinental Hotels Ha Noi Westlake',
    nameEn: 'InterContinental Hotels Ha Noi Westlake',
    category: 'hotel',
    starRating: 5,
    location: {
      address: '05 Tù Hoa, Quảng An, Tây Hồ, Hà Nội, Việt Nam',
      district: 'Tây Hồ',
      coordinates: {
        lat: 21.0667,
        lng: 105.8167
      }
    },
    priceRange: {
      from: 5500000,
      to: 8000000,
      currency: 'VND'
    },
    description: 'Nằm ở Hà Nội, cách Lăng Chủ tịch Hồ Chí Minh 2.36 km, Hoàng thành Thăng Long Hà Nội 2.65 km, Hồ Tây 818 m.',
    descriptionEn: 'Located in Hanoi, 2.36 km from Ho Chi Minh Mausoleum, 2.65 km from Thang Long Imperial Citadel, 818 m from West Lake.',
    amenities: [
      'Wi-Fi miễn phí',
      'Bể bơi',
      'Spa & Wellness',
      'Phòng gym',
      'Nhà hàng',
      'Bar',
      'Dịch vụ phòng 24/7'
    ],
    amenitiesEn: [
      'Free Wi-Fi',
      'Swimming pool',
      'Spa & Wellness',
      'Gym',
      'Restaurant',
      'Bar',
      '24/7 room service'
    ],
    services: [
      'Lễ tân 24/24',
      'Dịch vụ đưa đón sân bay',
      'Dịch vụ phòng',
      'Wi-Fi miễn phí'
    ],
    nearbyAttractions: [
      { name: 'Hồ Tây', distance: '818m' },
      { name: 'Lăng Chủ tịch Hồ Chí Minh', distance: '2.36km' },
      { name: 'Hoàng thành Thăng Long', distance: '2.65km' }
    ],
    contact: {
      phone: '+84 24 6270 8888',
      email: 'hanoi@ihg.com',
      website: 'https://www.ihg.com/intercontinental'
    },
    rating: {
      average: 4.7,
      count: 450
    },
    isActive: true,
    featured: true,
    tags: ['5-sao', 'luxury', 'ho-tay', 'trung-tam']
  }
];

const sampleFoods = [
  {
    name: 'Bún chả',
    nameEn: 'Grilled Pork with Rice Vermicelli',
    category: 'mon-an-dac-san',
    origin: 'Hà Nội',
    originEn: 'Hanoi',
    description: 'Bún chả là món ăn quen thuộc của người Việt. Món ăn bao gồm bún, chả thịt lợn nướng, ăn kèm bát nước mắm chua cay mặn ngọt.',
    descriptionEn: 'Bun cha is a familiar Vietnamese dish. The dish includes rice vermicelli, grilled pork patties, served with a bowl of sweet and sour fish sauce.',
    ingredients: [
      'Bún tươi',
      'Thịt lợn nạc',
      'Nước mắm',
      'Đường',
      'Chanh',
      'Tỏi',
      'Ớt',
      'Rau thơm'
    ],
    ingredientsEn: [
      'Fresh rice vermicelli',
      'Lean pork',
      'Fish sauce',
      'Sugar',
      'Lime',
      'Garlic',
      'Chili',
      'Herbs'
    ],
    restaurants: [
      {
        name: 'Bún chả Tuyết',
        nameEn: 'Bun Cha Tuyet',
        address: '34 Hàng Than, Ba Đình, Hà Nội',
        district: 'Ba Đình',
        phone: '024 3828 5555',
        openingHours: '8:30 - 17:30',
        priceRange: {
          from: 50000,
          to: 70000
        },
        rating: {
          average: 4.2,
          count: 120
        }
      },
      {
        name: 'Bún chả Đắc Kim',
        nameEn: 'Bun Cha Dac Kim',
        address: 'Số 1 Hàng Mành, Hàng Gai, Hoàn Kiếm, Hà Nội',
        district: 'Hoàn Kiếm',
        phone: '024 3928 5555',
        openingHours: '8:00 - 22:00',
        priceRange: {
          from: 70000,
          to: 120000
        },
        rating: {
          average: 4.5,
          count: 200
        }
      }
    ],
    priceRange: {
      from: 50000,
      to: 120000,
      currency: 'VND'
    },
    rating: {
      average: 4.4,
      count: 320
    },
    isActive: true,
    featured: true,
    tags: ['dac-san', 'ha-noi', 'bun-cha', 'am-thuc']
  }
];

const sampleEntertainments = [
  {
    name: 'Nhà hát Lớn Hà Nội',
    nameEn: 'Hanoi Opera House',
    category: 'van-hoa-nghe-thuat',
    type: 'nha-hat',
    location: {
      address: 'Số 1 Tràng Tiền, quận Hoàn Kiếm, Hà Nội',
      district: 'Hoàn Kiếm',
      coordinates: {
        lat: 21.0245,
        lng: 105.8572
      }
    },
    openingHours: {
      weekdays: '10:30, 14:00 (Tour tham quan)',
      weekends: 'Tùy theo chương trình',
      note: 'Nên kiểm tra và đặt vé trước'
    },
    ticketPrices: {
      adult: 120000,
      child: 60000,
      student: 80000,
      note: 'Bao gồm hướng dẫn viên và thuyết minh'
    },
    description: 'Nhà hát Lớn Hà Nội là một trong những công trình kiến trúc đẹp nhất của Hà Nội, được xây dựng theo phong cách Tân cổ điển Pháp.',
    descriptionEn: 'Hanoi Opera House is one of the most beautiful architectural works in Hanoi, built in French Neoclassical style.',
    history: 'Nhà hát Lớn được người Pháp xây dựng mô phỏng theo Nhà hát Opéra Garnier tại Paris, phục vụ tầng lớp thượng lưu và giới chức thực dân.',
    architecture: 'Mang đậm dấu ấn Tân cổ điển Pháp, là sự kết hợp hài hòa giữa vẻ đẹp nghệ thuật kiến trúc châu Âu và kỹ thuật xây dựng hiện đại.',
    experiences: [
      'Chiêm ngưỡng kiệt tác kiến trúc Pháp cổ điển',
      'Tham quan các không gian bên trong',
      'Tìm hiểu lịch sử nghệ thuật Hà Nội'
    ],
    experiencesEn: [
      'Admire French classical architectural masterpiece',
      'Visit interior spaces',
      'Learn about Hanoi art history'
    ],
    contact: {
      phone: '+84 24 3933 0113',
      email: 'info@hanoioperahouse.org.vn',
      website: 'https://hanoioperahouse.org.vn'
    },
    rating: {
      average: 4.6,
      count: 280
    },
    notes: [
      'Ăn mặc lịch sự khi vào tham quan hoặc xem biểu diễn'
    ],
    notesEn: [
      'Dress appropriately when visiting or watching performances'
    ],
    isActive: true,
    featured: true,
    tags: ['nha-hat', 'kien-truc', 'phap', 'van-hoa']
  }
];

const sampleTours = [
  {
    name: 'Tour Hà Nội 1 ngày - Khám phá di sản',
    nameEn: 'Hanoi 1-day Heritage Discovery Tour',
    category: '1-ngay',
    duration: '1 ngày',
    durationEn: '1 day',
    description: 'Tour khám phá các di sản văn hóa nổi tiếng nhất của Hà Nội trong 1 ngày.',
    descriptionEn: 'Tour to discover the most famous cultural heritages of Hanoi in 1 day.',
    highlights: [
      'Tham quan Văn Miếu - Quốc Tử Giám',
      'Khám phá Hoàng thành Thăng Long',
      'Dạo quanh Hồ Hoàn Kiếm',
      'Thưởng thức ẩm thực Hà Nội'
    ],
    highlightsEn: [
      'Visit Temple of Literature',
      'Explore Thang Long Imperial Citadel',
      'Walk around Hoan Kiem Lake',
      'Enjoy Hanoi cuisine'
    ],
    itinerary: [
      {
        day: 1,
        time: '8:00',
        activity: 'Đón khách tại khách sạn',
        activityEn: 'Pick up at hotel',
        location: 'Khách sạn',
        duration: '30 phút',
        note: 'Hướng dẫn viên đón khách'
      },
      {
        day: 1,
        time: '8:30',
        activity: 'Tham quan Văn Miếu - Quốc Tử Giám',
        activityEn: 'Visit Temple of Literature',
        location: 'Văn Miếu',
        duration: '2 giờ',
        note: 'Tìm hiểu lịch sử giáo dục Việt Nam'
      }
    ],
    priceRange: {
      from: 800000,
      to: 1200000,
      currency: 'VND',
      includes: [
        'Xe đưa đón',
        'Hướng dẫn viên',
        'Vé tham quan',
        'Bữa trưa'
      ],
      excludes: [
        'Đồ uống',
        'Chi phí cá nhân',
        'Tip cho hướng dẫn viên'
      ]
    },
    groupSize: {
      min: 2,
      max: 15
    },
    difficulty: 'easy',
    rating: {
      average: 4.5,
      count: 150
    },
    isActive: true,
    featured: true,
    tags: ['1-ngay', 'di-san', 'van-hoa', 'lich-su'],
    bookingInfo: {
      contact: '0901 234 567',
      website: 'https://hanoitours.com',
      note: 'Đặt tour trước ít nhất 1 ngày'
    }
  }
];

const sampleNews = [
  {
    title: 'Hà Nội mở cửa đón khách du lịch sau dịch COVID-19',
    titleEn: 'Hanoi reopens to welcome tourists after COVID-19',
    slug: 'ha-noi-mo-cua-don-khach-du-lich-sau-dich-covid-19',
    category: 'tin-tuc',
    summary: 'Hà Nội đã sẵn sàng đón khách du lịch trở lại với nhiều chương trình khuyến mãi hấp dẫn.',
    summaryEn: 'Hanoi is ready to welcome tourists back with many attractive promotional programs.',
    content: 'Sau thời gian dài đóng cửa do dịch COVID-19, Hà Nội đã mở cửa trở lại và sẵn sàng đón khách du lịch. Thành phố đã triển khai nhiều biện pháp an toàn và chương trình khuyến mãi hấp dẫn để thu hút du khách.',
    contentEn: 'After a long closure due to COVID-19, Hanoi has reopened and is ready to welcome tourists. The city has implemented many safety measures and attractive promotional programs to attract visitors.',
    author: 'Admin',
    images: [
      {
        url: '/client/img/news1.jpg',
        alt: 'Hà Nội mở cửa đón khách',
        isMain: true
      }
    ],
    tags: ['covid-19', 'mo-cua', 'du-lich', 'ha-noi'],
    featured: true,
    isActive: true,
    publishedAt: new Date(),
    views: 1250
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Attraction.deleteMany({});
    await Accommodation.deleteMany({});
    await Food.deleteMany({});
    await Entertainment.deleteMany({});
    await Tour.deleteMany({});
    await News.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username}`);
    }

    // Create attractions
    for (const attractionData of sampleAttractions) {
      const attraction = new Attraction(attractionData);
      await attraction.save();
      console.log(`Created attraction: ${attraction.name}`);
    }

    // Create accommodations
    for (const accommodationData of sampleAccommodations) {
      const accommodation = new Accommodation(accommodationData);
      await accommodation.save();
      console.log(`Created accommodation: ${accommodation.name}`);
    }

    // Create foods
    for (const foodData of sampleFoods) {
      const food = new Food(foodData);
      await food.save();
      console.log(`Created food: ${food.name}`);
    }

    // Create entertainments
    for (const entertainmentData of sampleEntertainments) {
      const entertainment = new Entertainment(entertainmentData);
      await entertainment.save();
      console.log(`Created entertainment: ${entertainment.name}`);
    }

    // Create tours
    for (const tourData of sampleTours) {
      const tour = new Tour(tourData);
      await tour.save();
      console.log(`Created tour: ${tour.name}`);
    }

    // Create news
    for (const newsData of sampleNews) {
      const news = new News(newsData);
      await news.save();
      console.log(`Created news: ${news.title}`);
    }

    console.log('Database seeding completed successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nDefault editor credentials:');
    console.log('Username: editor');
    console.log('Password: editor123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
