function generateRandomRatingAndReviews(): { rating: number; numReviews: number } { //TODO: Xoá hàm này khi có dữ liệu thực
    // rating từ 3.0 đến 5.0, làm tròn 1 chữ số thập phân
    const rating = Math.round((Math.random() * 3 + 2) * 10) / 10;

    // numReviews là số nguyên từ 0 đến 100
    const numReviews = Math.floor(Math.random() * 101);

    return { rating, numReviews };
}

// Hàm render sao (rating)
const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={i}>⭐</span>);
    }
    if (halfStar) stars.push(<span key="half">⭐️</span>);
    return stars;
};

export { generateRandomRatingAndReviews, renderStars };