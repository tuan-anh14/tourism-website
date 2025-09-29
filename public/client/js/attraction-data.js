/**
 * ===========================================
 * ATTRACTION DYNAMIC DATA MANAGEMENT
 * ===========================================
 * This file handles dynamic data for attraction pages
 * Designed for easy backend integration
 * ===========================================
 */

class AttractionDataManager {
    constructor() {
        this.defaultData = this.getDefaultData();
        this.currentData = null;
    }

    /**
     * Get default attraction data structure
     * This serves as fallback when no data is provided
     */
    getDefaultData() {
        return {
            // Basic Information
            title: 'Văn Miếu – Quốc Tử Giám',
            seoDescription: 'Di tích lịch sử – văn hóa nổi tiếng của Hà Nội, trường đại học đầu tiên của Việt Nam.',
            description: 'Văn Miếu – Quốc Tử Giám là quần thể di tích lịch sử, văn hóa nổi tiếng nằm ở trung tâm Hà Nội, được xây dựng từ năm 1070 dưới triều Lý. Đây là trường đại học đầu tiên của Việt Nam, nơi đào tạo và tôn vinh những bậc hiền tài cho đất nước. Với kiến trúc cổ kính, không gian tĩnh lặng cùng hệ thống bia tiến sĩ độc đáo, Văn Miếu – Quốc Tử Giám không chỉ là điểm đến hấp dẫn của du khách trong và ngoài nước, mà còn là biểu tượng của truyền thống hiếu học và nền văn hiến lâu đời của dân tộc Việt Nam.',
            
            // Location & Contact
            address: '58 Quốc Tử Giám, Văn Miếu – Quốc Tử Giám, Đống Đa, Hà Nội',
            lat: 21.027962,
            lng: 105.835515,
            mapZoom: 15,
            phone: '+84 24 3845 2917',
            website: 'https://vanmieu.gov.vn',
            
            // Media
            heroImage: '/client/img/carousel-img5.jpg',
            images: [
                '/client/img/carousel-img5.jpg',
                '/client/img/carousel-img4.jpg', 
                '/client/img/carousel-img6.jpg',
                '/client/img/img3.png'
            ],
            
            // Operating Information
            openHours: [
                'Mùa hè (15/4 - 15/10): 7:30 - 18:00',
                'Mùa đông (còn lại): 8:00 - 18:00'
            ],
            
            // Pricing
            tickets: [
                { type: 'Người lớn', price: '70.000 VNĐ' },
                { type: 'HSSV', price: '15.000 VNĐ', note: 'Cần thẻ học sinh/sinh viên' },
                { type: 'Người cao tuổi/khuyết tật nặng', price: '35.000 VNĐ' },
                { type: 'Miễn phí', price: '0 VNĐ', note: 'Trẻ dưới 15 tuổi, người khuyết tật, nhà giáo' }
            ],
            
            // Section 1: Introduction & Basic Info
            highlights: [
                'Kiến trúc cổ kính với Khuê Văn Các',
                'Hệ thống bia Tiến sĩ độc đáo',
                'Không gian tĩnh lặng, trang nghiêm',
                'Trường đại học đầu tiên của Việt Nam'
            ],
            
            amenities: [
                'Bãi đỗ xe',
                'Nhà vệ sinh công cộng',
                'Khu vực nghỉ ngơi',
                'Hướng dẫn viên du lịch',
                'Cửa hàng lưu niệm'
            ],
            
            // Section 2: Experiences & Guidelines
            experiences: [
                { 
                    icon: 'fa-university', 
                    title: 'Chiêm ngưỡng kiến trúc', 
                    text: 'Khuê Văn Các, giếng Thiên Quang, bia Tiến sĩ...', 
                    duration: '2-3 giờ', 
                    difficulty: 'Dễ' 
                },
                { 
                    icon: 'fa-history', 
                    title: 'Tìm hiểu lịch sử – giáo dục', 
                    text: 'Khám phá quá trình hình thành và chế độ khoa cử.', 
                    duration: '1-2 giờ', 
                    difficulty: 'Trung bình' 
                },
                { 
                    icon: 'fa-leaf', 
                    title: 'Không gian linh thiêng', 
                    text: 'Thắp hương tưởng nhớ các bậc hiền triết.', 
                    duration: '30 phút', 
                    difficulty: 'Dễ' 
                },
                { 
                    icon: 'fa-pencil', 
                    title: 'Trải nghiệm văn hóa', 
                    text: 'Xin chữ đầu năm, triển lãm thư pháp.', 
                    duration: '1 giờ', 
                    difficulty: 'Dễ' 
                }
            ],
            
            // Guidelines & Rules
            rules: [
                'Chấp hành quy định, không xâm hại hiện vật/cảnh quan.',
                'Trang phục lịch sự; không hút thuốc, đội nón trong khu trưng bày.',
                'Không nói tục, gây mất trật tự nơi tôn nghiêm.',
                'Thắp hương, dâng lễ đúng nơi quy định.',
                'Giữ gìn vệ sinh khu di tích.',
                'Ghi hình cần được sự đồng ý của ban quản lý.'
            ],
            
            tips: [
                'Nên tham quan vào buổi sáng để tránh đông người',
                'Mang theo nước uống và mũ nón',
                'Đọc trước thông tin lịch sử để hiểu rõ hơn',
                'Thời gian lý tưởng: 2-3 tiếng'
            ],
            
            // Reviews & Ratings
            reviews: [
                { name: 'Rachel', country: 'Việt Nam', rating: 5, text: 'Không gian cổ kính và trang nghiêm, trải nghiệm rất đáng giá.', avatar: '/client/img/avatar.png' },
                { name: 'Anh', country: 'Việt Nam', rating: 5, text: 'Kiến trúc đẹp, nhiều thông tin lịch sử bổ ích.', avatar: '/client/img/avatar.png' },
                { name: 'Minh', country: 'Việt Nam', rating: 5, text: 'Địa điểm tuyệt vời để tìm hiểu truyền thống hiếu học.', avatar: '/client/img/avatar.png' },
                { name: 'Lan', country: 'Việt Nam', rating: 5, text: 'Rất thích khu bia Tiến sĩ và Khuê Văn Các.', avatar: '/client/img/avatar.png' }
            ],
            
            // Additional Data
            mapEmbedUrl: 'https://www.google.com/maps?q=58+Qu%E1%BB%91c+T%E1%BB%AD+Gi%C3%A1m,+H%C3%A0+N%E1%BB%99i&output=embed',
            category: 'Di tích lịch sử',
            tags: ['Lịch sử', 'Văn hóa', 'Giáo dục', 'Kiến trúc cổ'],
            bestTimeToVisit: 'Tháng 10 - Tháng 4',
            averageVisitDuration: '2-3 giờ'
        };
    }

    /**
     * Initialize with provided data or use defaults
     * @param {Object} data - Attraction data from backend
     */
    initialize(data = null) {
        this.currentData = data ? this.mergeWithDefaults(data) : this.defaultData;
        return this.currentData;
    }

    /**
     * Merge provided data with defaults
     * @param {Object} data - Data from backend
     * @returns {Object} Merged data
     */
    mergeWithDefaults(data) {
        return {
            ...this.defaultData,
            ...data,
            // Deep merge for arrays and objects
            images: data.images || this.defaultData.images,
            openHours: data.openHours || this.defaultData.openHours,
            tickets: data.tickets || this.defaultData.tickets,
            highlights: data.highlights || this.defaultData.highlights,
            amenities: data.amenities || this.defaultData.amenities,
            experiences: data.experiences || this.defaultData.experiences,
            rules: data.rules || this.defaultData.rules,
            tips: data.tips || this.defaultData.tips,
            reviews: data.reviews || this.defaultData.reviews
        };
    }

    /**
     * Get current attraction data
     * @returns {Object} Current attraction data
     */
    getData() {
        return this.currentData || this.defaultData;
    }

    /**
     * Update specific field
     * @param {string} field - Field name
     * @param {any} value - New value
     */
    updateField(field, value) {
        if (this.currentData) {
            this.currentData[field] = value;
        }
    }

    /**
     * Get data for specific section
     * @param {string} section - Section name ('intro', 'experiences')
     * @returns {Object} Section-specific data
     */
    getSectionData(section) {
        const data = this.getData();
        
        switch (section) {
            case 'intro':
                return {
                    title: data.title,
                    description: data.description,
                    address: data.address,
                    openHours: data.openHours,
                    tickets: data.tickets,
                    highlights: data.highlights,
                    amenities: data.amenities
                };
            case 'experiences':
                return {
                    experiences: data.experiences,
                    rules: data.rules,
                    tips: data.tips
                };
            default:
                return data;
        }
    }
}

// Global instance
window.AttractionData = new AttractionDataManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttractionDataManager;
}
