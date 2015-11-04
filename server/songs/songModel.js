'use strict';
var mongoose = require('mongoose');

// NOTE ABOUT DATABASE SCHEMA
// _id (ObjectId) is included as default for all Schema
// With ObjectId as _id field, you don't need created_at field.
// ObjectIds have a method called getTimestamp().

// ObjectId("507c7f79bcf86cd7994f6c0e").getTimestamp()
// This will return the following output:
// ISODate("2012-10-15T21:26:17Z")

var Schema = mongoose.Schema;

//===========================
// Song schema
//===========================
var SongSchema = new Schema({
  uri: {type: String, required: true},
  title: {type: String, required: true},
  meta: {
    upvotes: Number,
    upvoteUsers: [{type: Schema.Types.ObjectId, ref: 'User'}], // references User _id
    downvotes:  Number,
    downvoteUsers: [{type: Schema.Types.ObjectId, ref: 'User'}] // references User _id
  },
  updatedAt: { type: Date },
  played: {
    type: Boolean,
    default: false
  }
});

SongSchema.methods.upvote = function () {
  this.meta.upvotes++;
  return this.save();
};

SongSchema.methods.downvote = function() {
  this.meta.downvotes--;
  return this.save();
};

// revise the updatedAt field before saving each entry
SongSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Song', SongSchema);
