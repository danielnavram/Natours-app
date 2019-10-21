const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');

// Middleware to check and set the user and tour IDs for create reviews
exports.setTourUserIds = (req, res, next) => {
  // Si no se define el tour ni el usuario entonces los toma del protect y el id en el URL
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Only can review booked tours
exports.reviewBookTour = catchAsync(async (req, res, next) => {
  // Catch the booking tours
  const booking = await Booking.find({ user: req.user.id }).select('name');
  // Map tours ID
  const tours = booking.map(el => el.tour);

  // Catch the tourId reviewed and verify in Maped tours
  if (!tours.includes(req.params.tourId)) {
    return next(
      new AppError(
        'This action is not allowed, you only can review a booked tour',
        400
      )
    );
  }
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
