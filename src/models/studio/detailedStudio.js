class DetailedStudio {
    constructor(id, title, imageUrl, detailedAddress, category, details, followers, coordinates, postedBy, reviews, events) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.address = detailedAddress;
        this.category = category;
        this.details = details;
        this.followers = followers;
        this.coordinates = coordinates;
        this.postedBy = postedBy;
        this.reviews = reviews;
        this.nReviews = reviews.length;
        this.avgRating = this.avgRating();
        this.events = events;
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

export default DetailedStudio;

