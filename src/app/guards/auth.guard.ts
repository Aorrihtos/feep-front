import { CanMatchFn } from '@angular/router';
import jwt_decode from 'jwt-decode';

import jwtDecode from "jwt-decode";
export const authGuard: CanMatchFn = (route, segments) => {
  const token = localStorage.getItem("token");
  if(token){
    const payload: any = jwtDecode(token);
    const now = Date.now().toString().slice(0,10);
    return payload.exp > now;
  }
  return false;
};
