import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetButton, ActionSheetController, Platform, ToastController } from '@ionic/angular';

import { Browser } from "@capacitor/browser";
import { Share } from "@capacitor/share";

import { StorageService } from '../../services/storage.service';

import { Article } from "src/app/interfaces";

@Component({
  selector: "app-article",
  templateUrl: "./article.component.html",
  styleUrls: ["./article.component.scss"],
})
export class ArticleComponent implements OnInit {
  @Input() article!: Article;
  @Input() index!: number;
  time!: string;
  date!: string;

  constructor( private actionSheetCtrl: ActionSheetController,
              private platform: Platform,
              private storageService: StorageService,
              private toastCtrl: ToastController) {}

  ngOnInit() {
    const dateTimeString = this.article.publishedAt;
    const dateTime = new Date(dateTimeString);
    this.date = dateTime.getDate() + "/" + (dateTime.getMonth() + 1) + "/" + dateTime.getFullYear();
    this.time = dateTime.toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  openArticle() {
    Browser.open({ url: this.article.url });
    // window.open( this.article.url, '_blank' )
  }

  async openMenu() {
    const articleInFavorite = this.storageService.articleInFavorite(this.article);

    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover de Favoritos' : 'Agregar a Favorito',
        icon: articleInFavorite ? 'star' : 'star-outline',
        handler: () =>  {
          this.toggleFavorite();
          this.presentToast();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      },
    ]
    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => {
        this.shareArticle();
      }
    };
      normalBtns.unshift(shareBtn);
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns
    });
    await actionSheet.present();
  }

  async shareArticle() {
    const { title, source, url } = this.article
    await Share.share({
      title: title,
      text: source.name,
      url: url
  });
  }

  toggleFavorite() {
    this.storageService.saveRemoveArticle(this.article);
  }

  async presentToast() {
    const articleInFavorite = this.storageService.articleInFavorite(this.article);
    const toast = await this.toastCtrl.create({
      message: articleInFavorite ? 'Agregado a Favoritos' : 'Removido de Favoritos' ,
      duration: 1500,
      icon: articleInFavorite ? 'star' : 'star-outline',
      position: 'top',
    });

    await toast.present();
  }
}
