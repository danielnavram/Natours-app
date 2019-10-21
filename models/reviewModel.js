const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'A review can not be empty']
    },
    rating: {
      type: Number,
      min: [1, 'A review must have a min rating of 1'],
      max: [5, 'A review must have a max rating of 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  // this.populate([
  //   {
  //     path: 'user',
  //     select: '-__v -role'
  //   },
  //   {
  //     path: 'tour',
  //     select: 'name price summary imageCover difficulty duration'
  //   }
  // ]);

  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
