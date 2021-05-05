export interface PlusOne {
  attending: true;
  createdAt: string;
  diet: string[] | null;
  drinking: boolean | null;
  firstName: string | null;
  guestId: number;
  id: number;
  lastName: string | null;
  over21: boolean | null;
  updatedAt: string;
}
export interface Guest {
  attending: boolean | null;
  createdAt: string;
  diet: string[] | null;
  drinking: boolean | null;
  firstName: string | null;
  groupId: number;
  id: number;
  lastName: string | null;
  over21: boolean | null;
  plusOneAllowed: boolean | null;
  plusOneId: number | null;
  plusone: PlusOne;
  updatedAt: string;
}
export interface Group {
  id: number;
  groupName: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  guests: Guest[];
}
