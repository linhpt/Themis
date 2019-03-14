export interface IRoom {
  id?: number;
  name?: string;
  description?: string;
  timeCreated?: string;
}
export interface IStudent {
  id?: number;
  mssv?: number;
  roomId?: number;
  roomName?: string;
  firstName?: string;
  lastName?: string;
  score?: string;
}