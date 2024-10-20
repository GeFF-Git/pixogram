import { AbstractControl } from "@angular/forms";
import { Observable,Observer, of } from "rxjs";


export const mimeType = (control : AbstractControl) : Promise<{[key: string] : any}> | Observable<{[key: string] : any}> | Observable<null> => {
    if (typeof(control.value) === 'string') {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    // const fileObservable = new Observable();
    const fileObservable = Observable.create((observer : Observer<{[key : string] : any} | null>)=>{
        fileReader.addEventListener("loadend",() => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
            let header : string = "";
            let isValid : Boolean = false;
            for (let index = 0; index < arr.length; index++) {
                header += arr[index].toString(16);
            }
            switch(header){
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;                        
            }
            if (isValid) {
                observer.next(null);
            }
            else{
                observer.next({InvalidMimeType: 'Uploaded file must be an image type'});
            }

            observer.complete();
            
        });
        fileReader.readAsArrayBuffer(file);
    });
    return fileObservable;

}