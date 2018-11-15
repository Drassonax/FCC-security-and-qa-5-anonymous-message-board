/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB

mongoose.connect(CONNECTION_STRING)

const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date
  },
  delete_password: {
    type: String
  },
  reported: {
    type: Boolean,
    default: false
  }
})

const threadSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date
  },
  bumped_on: {
    type: Date
  },
  reported: {
    type: Boolean,
    default: false
  },
  delete_password: {
    type: String,
    required: true
  },
  replies: {
    type: [replySchema]
  }
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post((req, res) => {
      let board = req.params.board || req.body.board
      let thread = new Thread({
        board,
        text: req.body.text,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        delete_password: req.body.delete_password,
        replies: []
      })
      thread.save((err, thread) => {
        res.redirect(`/b/${board}`)
      })
    })
    .get((req, res) => {
      Thread.find(
        {board: req.params.board},
        ['text', 'created_on', 'bumped_on', 'replies'],
        {
          skip:0,
          limit:10,
          sort:{
            bumped_on: -1
          }  
        },
        (err, docs) => {
          res.json(
            docs.map((thread) => {
              return {
                _id: thread._id,
                text: thread.text,
                created_on: thread.created_on,
                bumped_on: thread.bumped_on,
                replycount: thread.replies.length,
                replies: thread.replies.slice(0, 3).map((reply) => ({
                  text: reply.text,
                  created_on: reply.created_on
                }))
              }
            })
          )
        }
      )
    })
    .delete((req, res) => {
      if (req.body.thread_id && req.body.delete_password) {
        Thread.findById(req.body.thread_id, (err, doc) => {
          if (doc.delete_password === req.body.delete_password) {
            Thread.findByIdAndDelete(req.body.thread_id, (err, doc) => {
              res.send('thread deleted')
            })
          } else {
            res.send('incorrect password')
          }
        })
      } else {
        res.send('please provide thread ID and delete password')
      }
    })
    .put((req, res) => {
      Thread.findByIdAndUpdate(req.body.thread_id, {$set: {reported: true}}, (err, doc) => {
        res.send('thread reported')
      })
    })

  app.route('/api/replies/:board')
  .post((req, res) => {
    Thread.findByIdAndUpdate(
      req.body.thread_id,
      {
        bumped_on: new Date(),
        $push: {
          replies: {
            text: req.body.text,
            created_on: new Date(),
            delete_password: req.body.delete_password,
            reported: false
          }
        }
      },
      (err, doc) => {
        res.redirect(`/b/${req.params.board}/${req.body.thread_id}`)
      })    
  })
  .get((req, res) => {
    Thread.findById(req.query.thread_id, (err, doc) => {
      res.json(doc)
    })
  })
  .delete((req, res) => {
      Thread.findOneAndUpdate(
        {"_id": req.body.thread_id, "replies._id": req.body.reply_id, "replies.delete_password": req.body.delete_password},
        {
          $set: {
            "replies.$.text": 'DELETED'
          }
        },
        (err, doc) => {
          if (!doc) {
            res.send('wrong password')
          } else {
            res.send('post deleted')
          }
        }
      )
    })
  .put((req, res) => {
    Thread.findOneAndUpdate(
      {"_id": req.body.thread_id, "replies._id": req.body.reply_id},
      {
        $set: {
          "replies.$.reported": true
        }
      },
      (err, doc) => {
        res.send('post reported')
      }
    )
  })
};
