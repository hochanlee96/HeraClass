class SimpleStudio {
    constructor(id, title, imageUrl, simpleAddress, category, followers, coordinates, postedBy, reviews) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.address = simpleAddress;
        this.category = category;
        this.followers = followers;
        this.coordinates = coordinates;
        this.postedBy = postedBy;
        this.reviews = reviews;
        this.nReviews = reviews.length;
        this.avgRating = this.avgRating();
    }

    avgRating() {
        let sum = 0;
        if (this.nReviews === 0) {
            return null;
        } else {
            this.reviews.forEach(review => {
                sum = sum + review.rating;
            })
            return sum / this.nReviews;
        }
    }
}

export default SimpleStudio;
