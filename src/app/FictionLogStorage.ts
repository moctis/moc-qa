import { Injectable } from '@angular/core';
  // import LocalStorageDB from 'local-storage-db';

@Injectable()
export class FictionLogStorage {
  indexedDB: any;
  IDBTransaction: any;
  IDBKeyRange: any;
  public msg: any = "";
  db: any;
  values: any = [];

  clear() {
    this.values = [];
    this.msg = ""; 
  }

  openDb() {
    console.log('opendb');
    this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var request = this.indexedDB.open("toDoList", 4);
    request.onerror = () => this.msg += 'Error loading database.\n';

    request.onsuccess = (e) => {
      this.msg += 'Database initialised.\n';
      this.db = request.result;
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;

      db.onerror = function(event) {
        this.msg += 'Error loading database.\n';
      };

      // Create an objectStore for this database

      var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" });

      // define what data items the objectStore will contain

      objectStore.createIndex("hours", "hours", { unique: false });
      objectStore.createIndex("minutes", "minutes", { unique: false });
      objectStore.createIndex("day", "day", { unique: false });
      objectStore.createIndex("month", "month", { unique: false });
      objectStore.createIndex("year", "year", { unique: false });

      objectStore.createIndex("notified", "notified", { unique: false });

      this.msg += 'Object store created.\n';
    };
  };

  listDb() {
    this.msg += 'list db.\n';
    var objectStore = this.db.transaction('toDoList').objectStore('toDoList');
    this.values = [];
    objectStore.openCursor().onsuccess = (event) => {
      this.msg += 'opencursor.\n';
      var cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if(cursor) {
          this.values.push(cursor.value);
        }
    }
  }

  add(newItem) {
    var transaction = this.db.transaction(["toDoList"], "readwrite");
    transaction.oncomplete = () => {
      this.msg += 'Transaction completed: database modification finished.';
      this.listDb();
    }
    transaction.onerror = () => {
      this.msg += 'Transaction not opened due to error: ' + transaction.error;
    };

    var objectStore = transaction.objectStore("toDoList");
    console.log('adding ', newItem);
    var objectStoreRequest = objectStore.add(newItem);
    objectStoreRequest.onsuccess = () => {
      this.msg += 'Transaction onsuccess';
    };
  }
}