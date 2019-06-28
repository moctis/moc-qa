import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'hello',
  templateUrl: './hello.component.html',
  styleUrls: [ './hello.component.css' ]
})
export class HelloComponent  {
  @Input() name: string; 
  token:string = "";
  isToken: any;
  libraries:any;
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.libraries = JSON.parse(localStorage.getItem("libraries"));
    if (this.libraries == null) {
      this.getLibraries();
    } else {
      console.log(this.libraries);
    }
    var t = localStorage.getItem("access");
      if (t != undefined)
        this.token ="SAVED!";
  }

  clearAll() {
    var t = localStorage.getItem("access");
    localStorage.clear();    
    localStorage.setItem("access", t);
  }
 
 setToken() {
   localStorage.setItem("access", this.token);
 }
 
  getLibraries() {
    const access = localStorage.getItem("access");
    const options = {
    headers: new HttpHeaders({
      'Authorization': access
    }),};

    var req = {"operationName":null,"variables":{"filter":{"type":"book","sortBy":"activity"}},"query":"query ($filter: LibrariesFilter) {\n  libraries(filter: $filter) {\n    pageInfo {\n      endCursor\n      hasNextPage\n      __typename\n    }\n    edges {\n      node {\n        newChaptersCount\n        book {\n          _id\n          title\n          hasMatureContent\n          description\n          completed\n          coverImage\n          bundlePriceTierDetail {\n            _id\n            discount\n            __typename\n          }\n          category {\n            _id\n            name\n            __typename\n          }\n          user {\n            _id\n            username\n            displayName\n            __typename\n          }\n          __typename\n        }\n        ebook {\n          _id\n          title\n          description\n          hasMatureContent\n          coverImage\n          category {\n            _id\n            name\n            __typename\n          }\n          user {\n            _id\n            username\n            displayName\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"};
 
    this.http.post('https://api.k8s.fictionlog.co/graphql', req, options).subscribe(data => {
      console.log(data["data"]);
      this.libraries = data["data"].libraries.edges.map(p =>{
        var book = p.node.book;
        return { 
          _id : book._id,
          title: book.title,
          coverImage: book.coverImage,
          newChaptersCount: p.node.newChaptersCount
        };
      });
      
      localStorage.setItem("libraries", JSON.stringify(this.libraries));
    });  
  }
}
