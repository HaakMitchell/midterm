// You need to complete this controller with the required 7 actions
const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');
const reservation = require('../models/reservation');
const roomTypes = Reservation.schema.paths.roomType.enumValues;

exports.new = (req, res) => {
    res.render(`${viewPath}/new`,{
      pageTitle: 'New Reservation',
      roomTypes: ['Single Bed', 'Double Bed', 'Queen', 'King']
    });
  };

exports.index = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      
    res.render(`${viewPath}/index`, {
      pageTitle: 'yes',
      reservations: reservations
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the reservation: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let reservation = await Reservation.findById(req.body.id);
    if (!reservation) throw new Error('reservation could not be found');

    const attributes = {user: user._id, ...req.body};
    await Reservation.validate(attributes);
    await Reservation.findByIdAndUpdate(attributes.id, attributes);
    
    req.flash('success', 'The reservation was updated successfully');
    res.redirect(`/reservation/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this reservation: ${error}`);
    res.redirect(`/reservation/${req.body.id}/edit`);
  }
};

exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)

    res.render(`${viewPath}/show`, {
      pageTitle: 'yaya',
      reservation: reservation
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this reservation: ${error}`);
    res.redirect('/');
  }
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const reservation = await Reservation.create({user: user._id, ...req.body});
    console.log('User', user);

    req.flash('success', 'Reservation created successfully');
    res.redirect(`/reservations/${reservation.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this reservation: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reservations/new');
  }
};

exports.delete = async (req, res) => {
  try {
    await Reservation.deleteOne({_id: req.body.id});
    req.flash('success', 'The reservation was deleted successfully');
    res.redirect(`/reservations`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this reservation: ${error}`);
    res.redirect(`/reservations`);
  }
};

exports.edit = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: 'Edit',
      formData: reservation,
      roomTypes: ['Single Bed', 'Double Bed', 'Queen', 'King']
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this reservation: ${error}`);
    res.redirect('/');
  }
};