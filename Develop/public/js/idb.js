
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;


const database = "your-variable-name-here"
const objectStore = "your-variable-name-here"

const request = indexedDB.open(database, 1);

request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore(objectStore, { autoIncrement: true });
};


request.onsuccess = ({ target }) => {
  db = target.result;
  // check if app is online before reading from db
  if (navigator.onLine) {
    // method goes here
  }
};

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["OBJECT_STORE"], "readwrite");
  const store = transaction.objectStore("OBJECT_STORE");
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["OBJECT_STORE"], "readwrite");
  const store = transaction.objectStore("OBJECT_STORE");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("INSERT_UPDATE_ROUTE_NAME_HERE", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {        
        return response.json();
      })
      .then(() => {
        // delete indexedDB records if the update is successful
        const transaction = db.transaction([objectStore], "readwrite");
        const store = transaction.objectStore(objectStore);
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);