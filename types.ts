
export interface Drama {
  bookId: string;
  bookName: string;
  coverWap?: string;
  cover?: string;
  introduction?: string;
  chapterCount?: number;
  tags?: string[];
  author?: string;
  viewCount?: number;
  followCount?: number;
  playCount?: string;
  previewVideo?: string;
}

export interface VideoPath {
  quality: number;
  videoPath: string;
  isDefault: number;
}

export interface CDN {
  cdnDomain: string;
  isDefault: number;
  videoPathList: VideoPath[];
}

export interface Episode {
  chapterId: string;
  chapterIndex: number;
  chapterName: string;
  cdnList: CDN[];
}

export interface VIPResponse {
  columnVoList: {
    columnId: number;
    title: string;
    bookList: Drama[];
  }[];
}
