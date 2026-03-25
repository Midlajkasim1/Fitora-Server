import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";

export class AdvertisementEntity{
    private readonly _id?:string;
    private _brandName:string;
    private _startDate:Date;
    private  _expiryDate:Date;
    private _brandLink:string;
    private _bannerImages:string[];
    private _description?:string;
    private _status:AdvertisementStatus;
    private _createdAt?:Date;
    private _updatedAt?:Date;
 constructor(props:{
    id?:string;
    brandName:string;
    startDate:Date;
    expiryDate:Date;
    brandLink:string;
    bannerImages:string[];
    description?:string;
    status:AdvertisementStatus;
    createdAt?:Date;
    updatedAt?:Date;
 }){
    this._id = props.id;
    this._brandName = props.brandName;
    this._startDate = props.startDate;
    this._expiryDate = props.expiryDate;
    this._brandLink = props.brandLink;
    this._bannerImages = props.bannerImages;
    this._description = props.description;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

 }
static create(props:{
    id?:string;
    brandName:string;
    startDate:Date;
    expiryDate:Date;
    brandLink:string;
    bannerImages:string[];
    description?:string;
    status:AdvertisementStatus;
    createdAt?:Date;
    updatedAt?:Date;
}):AdvertisementEntity{
    return  new AdvertisementEntity({
        ...props,
        status: props.status ?? AdvertisementStatus.ACTIVE,
        createdAt: props.createdAt ?? new Date(),
        updatedAt:props.updatedAt ?? new Date()
    });
}
get id() {return this._id;}
get brandName() {return this._brandName;}
get startDate() {return this._startDate;}
get expiryDate() {return this._expiryDate;}
get brandLink() {return this._brandLink;}
get bannerImages() {return this._bannerImages;}
get description() {return this._description;}
get status() {return this._status;}
get createdAt() {return this._createdAt;}
get updatedAt() {return this._updatedAt;}

isActive():boolean{
const now = new Date();
return (
    this._status === AdvertisementStatus.ACTIVE && 
    now>=this._startDate &&  now<=this._expiryDate
);
}
isToggleStatus():void{
  this._status =  this._status === AdvertisementStatus.ACTIVE ? AdvertisementStatus.BLOCKED : AdvertisementStatus.ACTIVE;
}
}