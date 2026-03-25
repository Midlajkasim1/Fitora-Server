
import { IBaseRepository } from "../base.repository";
import { ClientPreferenceEntity } from "@/domain/entities/user/client-preference.entity";
export interface IClientPreferenceRepository extends IBaseRepository<ClientPreferenceEntity> {

  save(prefs: ClientPreferenceEntity): Promise<void>;

  findByUserId(userId: string): Promise<ClientPreferenceEntity | null>;
}