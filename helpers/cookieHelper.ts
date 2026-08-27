
import Cookies from "js-cookie"


export const setCookie = (name: string, value: string) =>{
   

   Cookies.set(name, JSON.stringify(value), { expires: 30 });
   return true;
}


export const getCookieValue = (name: string) => {
    const cookieValue = Cookies.get(name);
    return cookieValue ? JSON.parse(cookieValue) : null;
}