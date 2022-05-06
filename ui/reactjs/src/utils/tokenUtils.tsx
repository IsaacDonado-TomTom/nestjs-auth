// Short duration JWT token
export function getJwtToken() : string
{
    return sessionStorage.getItem("pongJwtAccessToken")
}

export function setJwtToken(token) : void
{
    sessionStorage.setItem("pongJwtAccessToken", token)
}

// Longer duration refresh token
export function getRefreshToken() : string
{
    return sessionStorage.getItem("pongJwtRefreshToken")
}

export function setRefreshToken(token) : void
{
    sessionStorage.setItem("pongJwtRefreshToken", token)
}