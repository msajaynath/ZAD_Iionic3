import { Injectable } from "@angular/core";

@Injectable()
export class LanguageService {
    private lang;

    constructor() {
      this.lang = 'en';  
    }

    setValue(val) {
        this.lang = val;
    }

    getValue() {
        return this.lang;
    }
}