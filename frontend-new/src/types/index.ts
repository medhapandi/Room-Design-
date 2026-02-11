export interface Room {
  id: number;
  name: string;
  width: number;
  depth: number;
}

export interface Furniture {
  id: number;
  name: string;
  type: string;
  width: number;
  depth: number;
}

export interface PlacedFurniture {
  id: number;
  furniture: Furniture;
  position: { x: number; y: number };
  rotation: number;
}

// Flat structure as returned by the API for saved designs
export interface SavedFurnitureItem {
  furniture_id: number;
  position_x: number;
  position_y: number;
  rotation: number;
}

export interface Design {
  id: number;
  name: string;
  room_id: number;
  furniture_items: SavedFurnitureItem[];
  created_at?: string;
}

export type RootStackParamList = {
  Home: undefined;
  RoomCreation: undefined;
  DesignStudio: { room: Room; savedFurniture?: SavedFurnitureItem[] };
  SavedDesigns: undefined;
  FurnitureCatalog: { onSelectFurniture: (furniture: Furniture) => void };
};