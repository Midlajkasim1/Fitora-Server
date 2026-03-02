import { SpecializationStatus } from "@/domain/constants/auth.constants";


export class SpecializationEntity {
  private   readonly _id? : string;
  private  _name : string;
  private  _description ?: string;
  private _imageUrl?: string;
  private _status : SpecializationStatus;
  private _createdAt? : Date;
  private _updatedAt?: Date;
 private constructor(props: {
    id?:string;
    name:string;
    description?:string;
    imageUrl?:string;
    status:SpecializationStatus;
    createdAt?:Date;
    updatedAt?:Date;


}) {
    this._id=props.id;
    this._name=props.name;
    this._description=props.description;
    this._imageUrl=props.imageUrl;
    this._status=props.status;
    this._createdAt=props.createdAt;
    this._updatedAt=props.updatedAt;

}
static create(props:{
  id?:string;
  name:string;
  description?:string;
  imageUrl?:string;
  status:SpecializationStatus;
  createdAt?:Date;
  updatedAt?:Date;

}): SpecializationEntity {
return new SpecializationEntity({
  ...props,
  status:props.status ?? SpecializationStatus.ACTIVE,
   createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  
});
}

get id() {return this._id;}
get name() { return this._name;}
get description(){return this._description;}
get imageUrl(){return this._imageUrl;}
get status (){return this._status;}
get createdAt() {return this._createdAt;}
get updatedAt() {return this._updatedAt;} 

isActive():boolean {
  return this._status === SpecializationStatus.ACTIVE;
}
toggleStatus():void{
   this._status = this._status === SpecializationStatus.ACTIVE ? SpecializationStatus.BLOCKED : SpecializationStatus.ACTIVE ;
}

}