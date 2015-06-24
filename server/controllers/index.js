
import UserController from './user';
import BeanController from './bean';
import Router from 'koa-router';
import fs from 'fs';
import path from 'path';


export default class Routes {

    constructor (app, passport) {
      var router = new Router();
      this.router = router;
      this.app = app;
      this.passport = passport;

      this.isAuthenticated = (app) => {
        console.log("app.isAuthenticated()", app.isAuthenticated());
        return app.isAuthenticated();
      }



    }

    setupPublicRoute() {
      var app = this.app;
      var passport = this.passport;

      let assets;
      if (process.env.NODE_ENV === 'development') {
        assets = fs.readFileSync(path.resolve(__dirname, '../webpack-stats.json'));
        assets = JSON.parse(assets);
      }
      else {
        assets = require('../webpack-stats.json');
      }

      console.log('assets', assets);

      var publicRoute = new Router()

      publicRoute.get('/auth/login', function*() {
        this.render('login', {assets})
      })




      publicRoute.get('/auth/facebook',
        passport.authenticate('facebook')
      )

      publicRoute.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
          successRedirect: '/',
          failureRedirect: '/auth/login'
        })
      )

      publicRoute.get('/rest/user/:id', UserController.get);
      publicRoute.get('/rest/user/', UserController.index);
      publicRoute.get('/rest/bean/', BeanController.index);


      app.use(publicRoute.middleware())

      var that = this;

      app.use(function*(next) {
        console.log('this.isAuthenticated()', this.isAuthenticated());
        if (that.isAuthenticated(this)) {
          yield next
        } else {
          console.log("=== final ===");
          this.redirect('/auth/login')
        }
      })

    }

    setupAppRoute() {

      this.router.post('/rest/user/', UserController.create);
      this.router.delete('/rest/user/:id', UserController.delete);

      this.app.use(this.router.middleware())


    }
}