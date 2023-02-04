export interface NewsResponse {
    status:       string;
    totalResults: number;
    articles:     Article[];
}

export interface Article {
    source:        Source;
    author?:       string | null;
    title:         string;
    description?:  string | null;
    url:           string;
    urlToImage?:   string | null;
    publishedAt:   Date | string;
    content?:      string | null;
}

export interface Source {
    id?:  string | null;
    name: string;
}

export interface ArticlesByCategoryAndPage {
    [key: string] : {
        page: number,
        articles: Article[]
    }
}