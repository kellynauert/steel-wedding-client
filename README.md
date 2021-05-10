# Wedding Site App

This app was created as my wedding information website with an integrated RSVP system. There is a backdoor at /guests and /groups to edit the guestlist. Only admin can delete guests or add new guests. Admin role must be added to a user directly either through postman or from the database.

## Project Set Up

1. Clone Repo

2. Run 'NPM Install' in both server and client directory

## Local development

1. Run 'Nodemon' in the server directory

   _Dialect Options in the db.js must be commented out to run locally!_

2. Run 'NPM Start' in the client directory

## Public site

1. From main/master in client/server directory, 'Git push Heroku main/master'

   If pushing client, run 'NPM run build'
