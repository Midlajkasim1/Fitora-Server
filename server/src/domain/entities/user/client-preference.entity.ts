import { DietPreference, ExperienceLevel } from "@/domain/constants/auth.constants";

export class ClientPreferenceEntity {
private readonly _id?: string;
  private readonly _userId: string;
  private readonly _sleepHours: number;
  private readonly _waterIntake: number; 
  private readonly _primaryMotives: string[];
  private readonly _preferredWorkouts: string[];
  private readonly _experienceLevel: ExperienceLevel; 
  private readonly _dietPreference: DietPreference; 
  private readonly _medicalConditions: string[];

  constructor(props: {
id?: string;
    userId: string;
    sleepHours: number;
    waterIntake: number;
    primaryMotives: string[];
    preferredWorkouts: string[];
    experienceLevel: ExperienceLevel;
    dietPreference: DietPreference;
    medicalConditions: string[];
  }) {
 this._id = props.id;
    this._userId = props.userId;
    this._sleepHours = props.sleepHours;
    this._waterIntake = props.waterIntake;
    this._primaryMotives = props.primaryMotives;
    this._preferredWorkouts = props.preferredWorkouts;
    this._experienceLevel = props.experienceLevel;
    this._dietPreference = props.dietPreference;
    this._medicalConditions = props.medicalConditions;
  }

static create(props: {
    userId: string;
    sleepHours: number;
    waterIntake: number; 
    primaryMotives: string[];
    preferredWorkouts: string[];
    experienceLevel: ExperienceLevel;
    dietPreference: DietPreference;
    medicalConditions: string[];
  }): ClientPreferenceEntity {
    return new ClientPreferenceEntity(props);
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get sleepHours() { return this._sleepHours; }
  get waterIntake() { return this._waterIntake; } 
  get primaryMotives() { return this._primaryMotives; }
  get preferredWorkouts() { return this._preferredWorkouts; }
  get experienceLevel() { return this._experienceLevel; }
  get dietPreference() { return this._dietPreference; }
  get medicalConditions() { return this._medicalConditions; }
}