import { Component } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor( private storageService: StorageService ) {}

  get getArticles(): Article[] {
    return this.storageService.getLocalArticles;
  }

}
