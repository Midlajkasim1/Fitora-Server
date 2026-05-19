
import { ClientPreferenceEntity } from "@/domain/entities/user/client.preference.entity";
import { IBaseRepository } from "../base.repository";
export interface IClientPreferenceRepository extends IBaseRepository<ClientPreferenceEntity> {

  save(prefs: ClientPreferenceEntity): Promise<void>;

  findByUserId(userId: string): Promise<ClientPreferenceEntity | null>;
}