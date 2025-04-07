import ILote from "../domain/lote.repository";
import { CreateLoteRequest } from "../domain/CreateLoteRequest";
import { CreatedLoteResponse } from "../domain/CreatedLoteResponse";

export class CreateLote {
  private repository: ILote;

  constructor(repository: ILote) {
    this.repository = repository;
  }

  async execute(loteRequest: CreateLoteRequest): Promise<CreatedLoteResponse> {
    return await this.repository.Create(loteRequest);
  }
}