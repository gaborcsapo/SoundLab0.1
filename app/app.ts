import {Component} from '@angular/core';
import {Platform, MenuController, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {

  private rootPage: any;

  constructor(
    private platform: Platform,
    private menu: MenuController) 
  {
    this.rootPage = HomePage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
  openPage(page) {
    // Reset the nav controller to have just this page
    // we wouldn't want the back button to show in this scenario
    this.rootPage = page;

    // close the menu when clicking a link from the menu
    this.menu.close();
  }
}

ionicBootstrap(MyApp);
