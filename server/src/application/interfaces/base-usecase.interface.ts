export interface IBaseUseCase<I, O> {
  execute(dto: I): Promise<O>;
}