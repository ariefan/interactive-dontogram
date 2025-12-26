export type ToothSurface = 'O' | 'M' | 'D' | 'V' | 'L' | 'ROOT'; 
// O=Occlusal/Incisal, M=Mesial, D=Distal, V=Vestibular/Buccal, L=Lingual/Palatal, ROOT=Root

export enum ToothCondition {
  HEALTHY = 'Healthy',
  CARIES = 'Caries',
  AMALGAM = 'Amalgam',
  COMPOSITE = 'Composite',
  CROWN = 'Crown',
  MISSING = 'Missing',
  ROOT_CANAL = 'Root Canal',
  IMPLANT = 'Implant',
  SEALANT = 'Sealant'
}

export interface ToothState {
  id: number;
  surfaces: Record<ToothSurface, ToothCondition>;
  notes?: string;
  hasCondition: boolean; // Helper to quickly check if marked
}

export interface DentalChartData {
  teeth: Record<number, ToothState>;
}

export type ToolType = 'select' | 'eraser' | 'caries' | 'restoration_amalgam' | 'restoration_composite' | 'crown' | 'missing' | 'rct' | 'sealant';

export interface Treatment {
  id: string;
  toothId: number;
  surfaces: ToothSurface[];
  condition: ToothCondition;
  date: string;
  price: number;
}