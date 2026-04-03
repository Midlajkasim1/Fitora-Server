export class MarkReadRequestDTO{
    notificationId!:string;
    constructor(data:MarkReadRequestDTO){
        Object.assign(this,data);
    }
}
