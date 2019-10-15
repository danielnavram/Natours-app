const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Find the tours on DB
  const tours = await Tour.find();

  // 2.Prepare the templates

  // 3. Render the template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get data and populate reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user'
  });

  // 2) Error handler
  if (!tour) {
    return next(new AppError('No tour found with that name!', 404));
  }

  // 3. Render the template
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login User'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
};

exports.updateUser = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
};
