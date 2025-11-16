export interface PlanInputs {
  ingresos: number;
  gastos: number;
  metas: string;
  horarioDisponible: string;
  areaMejorar: string;
  nivelCaos: string;
}

export interface PlanOutputs {
  finanzas: string;
  habitos: string;
  horario: string;
  sieteDias: string;
}

export interface AiLifePlan {
  id: string;
  user_id: string;
  name: string;
  inputs_json: {
    inputs: PlanInputs;
    outputs: PlanOutputs;
  };
  created_at: string;
}

export interface CreatePlanPayload {
  name: string;
  inputs: PlanInputs;
  outputs: PlanOutputs;
}
