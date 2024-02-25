export interface User {
  id?: number;
  heb_name?: string;
  username?: string;
  email?: string;
  password?: string;

  dob?: Date;

  blood?: string;

  avatar?: string;

  id_nr?: string;

  birth_hospital?: string;

  birth_place?: string;

  heb_family?: string;

  eng_name?: string;

  eng_family?: string;

  phone?: string;

  gender?: number;

  login?: string;

  former_family?: string;

  former_eng_family?: string;

  map?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}
