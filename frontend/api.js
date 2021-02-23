const conf = require('./conf')
const HOST = conf.default.HOST       // API GW HOST
const API_KEY = conf.default.API_KEY // API GW API KEY

export default class APIHandler {
  constructor() {
    this.dummyData = [
      {
        id: "abc123",
        title: "데이터베이스 구축하기",
        category: "ongoing"
      },
      {
        id: "def456",
        title: "데이터베이스 삭제하기",
        category: "todo"
      }
    ];
    
  }

  // TODO: 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {
    const req = new RESTAPIRequest('GET', '/kanban/cards/');
    const resp = await APIProcessor(req);
    if (resp != 'ERROR') 
      return resp.Items;

    else return null;
    
  }

  // TODO: 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {
    const req = new RESTAPIRequest('POST', '/kanban/cards', {title:cardObj.title, category:cardObj.category});
    const resp = await APIProcessor(req);
    if (resp != 'ERROR') {
    }
    else {
    }
  }

  // TODO: ID로 카드 검색 후 내용,카테고리 수정
  async putCard(cardObj) {
    const req = new RESTAPIRequest('PUT', `/kanban/cards/${cardObj.id}`, {title:cardObj.title, category:cardObj.category});
    const resp = await APIProcessor(req);
    if (resp != 'ERROR') {
    }
  }

  // TODO: ID로 카드 검색 후 삭제
  async deleteCard(id) {
    const req = new RESTAPIRequest('DELETE', `/kanban/cards/${id}`);
    const resp = await APIProcessor(req);
    if (resp != 'ERROR') {
    }
  }

  async login(id, pw) {
    const req = new RESTAPIRequest('POST', '/kanban/auth', {"id": id})
    const resp = await APIProcessor(req);
    console.log(resp)
    if (resp.token) {
      //globalThis.token = 'Bearer ' + resp.token; 
      window.sessionStorage.setItem('awskanban', 'Bearer ' + resp.token)
      location.reload();
    }
    // login error handling
  }
}

// TODO: API 요청 컨테이너. Method, Path, Body 속성
class RESTAPIRequest {
  constructor (method, path, body=null) {
    this.method = method;
    this.url = HOST + path;
    this.body = body;
  }
}



// TODO: API 호출 함수
const APIProcessor = async (request) => {
  try {
    var key = window.sessionStorage.getItem('awskanban');
    if (key) 
      var opt = {
        method:request.method,
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key':API_KEY,
          'Authorization': key

        },
        body:request.body ? JSON.stringify(request.body) : null
      }
    else 
      var opt = {
        method:request.method,
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key':API_KEY,
        },
        body:request.body ? JSON.stringify(request.body) : null
      }
  var resp = await fetch(request.url, opt
    );
    // check
    switch (resp.status) {
      case 200:
        return await resp.json();
      case 401:
        // rollback data
        var trig = document.getElementById('login-trig')
        trig.click()
        return undefined;
      default:
        console.log('ERROR: ' + await resp.json());
        break;
    }
  }
  catch (e) {
    console.error(e);
  }
  return 'ERROR';
}