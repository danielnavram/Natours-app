/* eslint-disable */
import axios from 'axios';

export const bookTour = async tourId => {
  const stripe = Stripe('pk_test_RA7itTOR3vsyjrWjTxFyvLuN00Oew2ObIH');
  // 1) Get checkout session from API
  const session = await axios(
    `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
  );

  console.log(session);

  // 2) Create checkout form + charge credit card
};
