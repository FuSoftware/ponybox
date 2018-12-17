import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../services/config';

@Injectable()
export class ApiProvider {
    private baseUrl: string;

    constructor(
        public http: HttpClient,
        protected config: Config,
    ) {
        this.baseUrl = this.config.get('apiUrl');
    }
    
    sendRequest(
        requestType : 'post'|'get',
        url : string,
        params: {[param: string]: string},
        callback?: (data?: any) => any
    ) {        
        var headers = undefined;
        let getParams, postParams;
        if (requestType === 'post') {
            headers = this._createHeaders();
            postParams = params;
        } else {
            getParams = new HttpParams({fromObject : params});
        }
        return new Promise(
            (resolve) => {
                this.http.request(requestType, this.baseUrl + '/' + url, {body: postParams, params : getParams, headers: headers}).subscribe(
                    (data: any) => {
                        if (typeof(callback) === 'undefined' || callback === null) {
                            resolve(data);
                        } else {
                            resolve(callback(data))
                        }
                    }
                );
            }
        );
    }
    
    protected _createHeaders() {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Access-Control-Allow-Origin' , '*');
        headers = headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        return headers;
    }
    
    login(username: string, password : string) {
        return this.sendRequest(
            'post',
            'pb-login.php',
            {username : username, password : password},
            (data) => {
                if (!data.hasOwnProperty('valid')) {
                    data = {
                        valid : false,
                        error : null
                    };
                }
                return data;
            }
        );
    }
}
