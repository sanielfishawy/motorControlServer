import base64 from 'base-64'

export function headersAddBasicAuth(headers, user, password){
    let hdr = headers || new Headers()
    user = user 
    password = password 

    hdr = headersNoAuth(hdr)
    const up = base64.encode(`${user}:${password}`)
    const basic = `Basic ${up}`
    hdr.set('Authorization', basic);
    return hdr
}

export function headersWithBasicAuth(user, password){
    user = user 
    password = password 
    const hdr = headersNoAuth()
    const up = base64.encode(`${user}:${password}`)
    const basic = `Basic ${up}`
    hdr.set('Authorization', basic);
    return hdr
}

export function headersNoAuth(headers){
    const hdr = headers || new Headers()
    hdr.set('Content-type', 'application/json')
    return hdr
}

export function headersWithCookie(cookie, headers){
    let hdr = headers || headersNoAuth()
    hdr.set('Cookie', cookie)
    return hdr
}
