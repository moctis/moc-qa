import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fictionlog',
  templateUrl: './fictionlog.component.html',
  styleUrls: ['./fictionlog.css'],
})
export class FictionlogComponent {
  @Input() name: string;
  token: string = "";
  chapterId: string = "5c1b1775a61d8b3255ac24da";
  bookId: string = "5b73fe93c7d65a2966068482";
  data: any;
  book: any = {};
  current: any;
  chapterIndex: any = 0;
  eventText: string;
  bookInfo: any;
  blocks: any[] = [];
  private sub: any;
  errorText: any;
  time = 30*1000;

  constructor(private http: HttpClient, private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
    this.current = { chapterIndex: 0 };
  }

  ngOnInit() {
    var t = localStorage.getItem("access");
    if (t != undefined)
      this.token = "SAVED!";

    this.sub = this.route.params.subscribe(params => {
      this.bookId = params['id']; // (+) converts string 'id' to a number
      this.current = { chapterIndex: 0 };
      this.load();
      // In a real app: dispatch action to load the details here.
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  load() {
    this.blocks = [];
    try {
      var libraries = JSON.parse(localStorage.getItem("libraries"));
      this.bookInfo = libraries.find(p => p._id == this.bookId);

      this.current = JSON.parse(localStorage.getItem("current." + this.bookId)) || {};
      this.book = JSON.parse(localStorage.getItem("bookId." + this.bookId));

      this.swipe(0);
      // this.chapterId = this.book.chapterList.chapters[this.current.chapterIndex]._id;
      // this.data = JSON.parse(localStorage.getItem("chapterId." + this.chapterId));
    } catch (e) { this.errorText = e; }

  }
  setToken() {
    localStorage.setItem("access", this.token);
  }

  loadChapter() {
    try {
      this.chapterId = this.book.chapterList.chapters[this.current.chapterIndex]._id;
      this.data = JSON.parse(localStorage.getItem("chapterId." + this.chapterId));
      this.blocks = [];
    } catch (e) { this.errorText = e; }
  }

  swipe(diff) {
    this.data = {};
    var count = 0;
    try {
      count = this.book.chapterList.chapters.length;
    } catch{ count = 1; }

    this.current.chapterIndex = this.current.chapterIndex || 0;
    this.current.chapterIndex += diff;
    this.current.chapterIndex = (this.current.chapterIndex + count) % count;
    localStorage.setItem("current." + this.bookId, JSON.stringify(this.current));
    this.loadChapter();
  }

  getBookDetail() {
    const access = localStorage.getItem("access");
    const options = {
      headers: new HttpHeaders({
        'Authorization': access
      }),
    };
    var req = { "operationName": null, "variables": { "bookId": this.bookId }, "query": "query ($bookId: ID!) {\n  book(bookId: $bookId) {\n    ...BookFragment\n    canSellBundle\n    isWriter\n    status\n    hasMatureContent\n    description\n    viewsCount\n    inLibrariesCount\n    hasPaidChapter\n    userReviewSummary {\n      label\n      color\n      __typename\n    }\n    userReviewsCount {\n      positive\n      negative\n      total\n      __typename\n    }\n    bundlePrice {\n      goldCoin\n      __typename\n    }\n    totalPrice {\n      goldCoin\n      __typename\n    }\n    chaptersCount {\n      public\n      draft\n      total\n      __typename\n    }\n    neighbors {\n      _id\n      coverImage\n      title\n      completed\n      bundlePriceTierDetail {\n        _id\n        discount\n        __typename\n      }\n      user {\n        _id\n        displayName\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BookFragment on Book {\n  _id\n  coverImage\n  bannerImage\n  bundlePurchased\n  title\n  contentRawState\n  addedToLibrary\n  hashtags\n  hasMatureContent\n  placeholderBackgroundColor\n  description\n  viewsCount\n  completed\n  publishedAt\n  status\n  latestChapterPublishedAt\n  latestViewedChapter\n  bundlePriceTierDetail {\n    _id\n    discount\n    __typename\n  }\n  category {\n    _id\n    name\n    __typename\n  }\n  user {\n    _id\n    username\n    displayName\n    __typename\n  }\n  __typename\n}\n" };

  }
  getBook() {
    const access = localStorage.getItem("access");
    const options = {
      headers: new HttpHeaders({
        'Authorization': access
      }),
    };

    var req = { "operationName": null, "variables": { "bookId": this.bookId }, "query": "query ($bookId: ID!, $filter: ChapterListFilter) {\n  chapterList(bookId: $bookId, filter: $filter) {\n    chapters {\n      _id\n      title\n      viewsCount\n      chapterCommentsCount\n      isPurchaseRequired\n      publishedAt\n      status\n      book {\n        _id\n        __typename\n      }\n      price {\n        type\n        silverCoin\n        goldCoin\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n" };

    this.spinnerService.show();
    //setTimeout(() => this.spinnerService.hide(), this.time);
    this.http.post('https://api.k8s.fictionlog.co/graphql', req, options).subscribe(data => {
      this.book = data['data'];

      localStorage.setItem("bookId." + this.bookId, JSON.stringify(this.book));
      this.current.bookId = this.bookId;
      localStorage.setItem("current." + this.bookId, JSON.stringify(this.current));
      this.swipe(0);
      this.spinnerService.hide();
      //{{book?.chapterList?.chapters[current.chapterIndex]?.title}}
    });
  }

  getChapter() {
    const access = localStorage.getItem("access");
    const options = {
      headers: new HttpHeaders({
        'Authorization': access
      }),
    };
    this.chapterId = this.book.chapterList.chapters[this.current.chapterIndex]._id;


    var req = { "operationName": null, "variables": { "chapterId": this.chapterId }, "query": "query ($chapterId: ID!) {\n  chapter(chapterId: $chapterId) {\n    ...ChapterFragment\n    priceId\n    userId\n    viewsCount\n    chapterCommentsCount\n    book {\n      _id\n      title\n      description\n      coverImage\n      addedToLibrary\n      hasPaidChapter\n      bundlePurchased\n      bundlePrice {\n        goldCoin\n        __typename\n      }\n      totalPrice {\n        goldCoin\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ChapterFragment on Chapter {\n  _id\n  title\n  contentRawState\n  isWriter\n  status\n  publishedAt\n  isPurchaseRequired\n  priceId\n  price {\n    type\n    goldCoin\n    silverCoin\n    __typename\n  }\n  user {\n    _id\n    displayName\n    username\n    __typename\n  }\n  nextChapter {\n    _id\n    title\n    price {\n      type\n      goldCoin\n      silverCoin\n      __typename\n    }\n    status\n    purchased\n    bookId\n    __typename\n  }\n  editChapter {\n    _id\n    title\n    contentRawState\n    status\n    rejectNote\n    __typename\n  }\n  __typename\n}\n" }
    this.spinnerService.show();
    //setTimeout(() => this.spinnerService.hide(), this.time);
    this.http.post('https://api.k8s.fictionlog.co/graphql', req, options).subscribe(data => {
      this.setChapter(data['data'])
      this.spinnerService.hide();
    });
  }

  splitBlocks(data) {
    var x = data || {};
    x = x.chapter || {};
    x = x.contentRawState || {};
    data = x.blocks || {};

    console.log('split data', data);
    var result = [];
    data.forEach(p => {
      //var txt = p.text.replace(/\n\n/g, "\n")
      var txt = p.text;
      var txts = txt.split("\n\n");
      
      txts.forEach( t => {
        
        var newBlock = {
          data: p.data,
          depth: p.depth,
          entityRanges: p.entityRanges,
          inlineStyleRanges: p.inlineStyleRanges,
          key: p.key,
          text: t.trim(),
          type: p.type
        };
        if (newBlock.text != "") {
          result.push(newBlock);
        }
      }); 
    });
    console.log('split result', result)
    return result;
  }

  setChapter(data) {
    this.data = data;
    this.blocks = [];
    //console.log('this.data', data.chapter.contentRawState);
    this.blocks = this.splitBlocks(data);
    //console.log('setChapter', this.blocks);
    // localStorage.setItem("chapterId."+this.chapterId, JSON.stringify(this.data));
    this.current.chapterId = this.chapterId;
    localStorage.setItem("current." + this.bookId, JSON.stringify(this.current));

    this.book.chapterList.chapters[this.current.chapterIndex].isPurchaseRequired = this.data.chapter.isPurchaseRequired;
    localStorage.setItem("bookId." + this.bookId, JSON.stringify(this.book));
 
  }

  purchaseChapter() {

    var chapter = this.book.chapterList.chapters[this.current.chapterIndex];
    if (chapter.isPurchaseRequired == false)
      return;
    this.chapterId = chapter._id;

    var price = chapter.price;
    var coinType = "";
    var amount = 0;
    if (price.silverCoin != null) {
      coinType = "silverCoin";
      amount = price.silverCoin;
    } else {
      coinType = "goldCoin";
      amount = price.goldCoin;
    }

    const access = localStorage.getItem("access");
    const options = {
      headers: new HttpHeaders({
        'Authorization': access
      }),
    };

    var req = { "operationName": null, "variables": { "chapterId": this.chapterId, "input": { "coinType": coinType, "amount": amount } }, "query": "mutation ($chapterId: ID!, $input: PurchaseInput!) {\n  purchaseChapter(chapterId: $chapterId, input: $input) {\n    ...ChapterFragment\n    viewsCount\n    chapterCommentsCount\n    book {\n      _id\n      title\n      coverImage\n      addedToLibrary\n      hasPaidChapter\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ChapterFragment on Chapter {\n  _id\n  title\n  contentRawState\n  isWriter\n  status\n  publishedAt\n  isPurchaseRequired\n  priceId\n  price {\n    type\n    goldCoin\n    silverCoin\n    __typename\n  }\n  user {\n    _id\n    displayName\n    username\n    __typename\n  }\n  nextChapter {\n    _id\n    title\n    price {\n      type\n      goldCoin\n      silverCoin\n      __typename\n    }\n    status\n    purchased\n    bookId\n    __typename\n  }\n  editChapter {\n    _id\n    title\n    contentRawState\n    status\n    rejectNote\n    __typename\n  }\n  __typename\n}\n" }
    this.spinnerService.show();
    //setTimeout(() => this.spinnerService.hide(), this.time);
    this.http.post('https://api.k8s.fictionlog.co/graphql', req, options).subscribe(data => {
      //console.log('done');
      //console.log(data);
      chapter.silverCoin = null;
      chapter.goldCoin = null
      chapter.isPurchaseRequired = false;
      this.setChapter({ 'chapter': data['data']['purchaseChapter'] })
      this.spinnerService.hide();
    });
  }


  onSwipe(evt) {
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    this.eventText += `${x} ${y}<br/>`;
  }
}
