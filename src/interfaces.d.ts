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
  children: integer;
  createdAt: string;
  updatedAt: string;
  guests: Guest[];
}

export interface Data {
  attending: number;
  both: number;
  drinking: number;
  invited: number;
  invites: number;
  notAttending: number;
  pescatarian: number;
  plusOnes: number;
  vegetarian: number;
}
