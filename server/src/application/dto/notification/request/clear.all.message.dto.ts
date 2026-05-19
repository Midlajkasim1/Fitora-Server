export class ClearAllNotificationRequestDTO{
    userId!:string;
    constructor(data:ClearAllNotificationRequestDTO){
        Object.assign(this,data);
    }
}