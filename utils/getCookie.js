function getCookieVal(cname){
    const allCookie = document.cookie;

    const cookieSplitter = allCookie.split(';');

    let key = '';
    let val = '';
    let cookieIndex = 0;

    while(key != cname && cookieIndex < cookieSplitter.length - 1){
        const eleSplitter = cookieSplitter[cookieIndex].split('=');
        key = eleSplitter[0];
        key = key.replace(' ', '');

        if(key === cname){
            val = eleSplitter[1];
        }

        cookieIndex++;
    }

    return val;
}