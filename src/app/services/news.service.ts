import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Article, NewsResponse, ArticlesByCategoryAndPage } from "../interfaces";
import { storedArticlesByCategory } from "../data/mock-news";


const apiKey = environment.apiKey;                                                         //* El apiKey se encuentra en el archivo 'environment.ts' en la ruta: (src\environments\environment.ts)
const apiUrl = environment.apiUrl;                                                         //* El apiUrl se encuentra en el archivo 'environment.ts' en la ruta: (src\environments\environment.ts)

@Injectable({
  providedIn: "root",
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = storedArticlesByCategory;

  private executeQuery<T>( endpoint: string ) {
    console.log('Petición HTTP realizada')
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: { 
        apiKey: apiKey,
        country: 'us',
      }
    })
  }

  constructor(private http: HttpClient) {}

  getTopHeadlines(): Observable <Article[]> {
    return this.getTopHeadlinesByCategory('business')                                       //* Este código está mas optimizado debido a que evita hacer la petición de la categoría 'business' cuando el usuario se encuentra en el tab de 'Para ti'
    // return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
    // .pipe(map ( ({articles}) => articles ) );                                            //* En este segmento del código se hace una desestructuración del objeto 'articles' para quedar solo con la informacion que contiene el array 'articles'
  }

  getTopHeadlinesByCategory( category: string, loadMore: boolean = false ): Observable<Article[]> {

    return of(this.articlesByCategoryAndPage[category].articles);                           //* Esto se puede borrar luego

    if ( loadMore ) {
      return this.getArticlesByCategory( category );
    } 
    if ( this.articlesByCategoryAndPage[category] ) {
      return of(this.articlesByCategoryAndPage[category].articles);
    }
    return this.getArticlesByCategory( category );
  } 

  private getArticlesByCategory( category: string ): Observable<Article[]> {
    if ( Object.keys ( this.articlesByCategoryAndPage ).includes(category) ) {
    //? Ya existe
      // this.articlesByCategoryAndPage[category].page += 0;                                //? este código no hace falta ya que luego se incrementa el page en 1
    } else {
    //? No existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }
    
    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
    .pipe(
      map( ({ articles }) => {
        if ( articles.length === 0 ) return this.articlesByCategoryAndPage[category].articles;
        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
        }
        return this.articlesByCategoryAndPage[category].articles;
      })
    );
  }
}
