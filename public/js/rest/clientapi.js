/**
 * Ideia parcialmente trazida de https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/
 * outra fonte
 * https://www.toptal.com/nodejs/secure-rest-api-in-nodejs
 */

//todo Se necessário incorporar parte mais responsiva em: https://github.com/cujojs/rest
// https://github.com/cujojs/rest/blob/master/client/xhr.js
 


const domain = "";

async function signin(data) {
    const res = await fetch(`${domain}/signin`, {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });
    return res;
}

async function signup(data) {
    const res = await fetch(`${domain}/signup`, {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    });
    return res;
}


async function create(resource, data) {
    //submete criação de recurso
    return requestWithToken("post", resource, data);
}

async function read(resource) {
    //submete leitura de recurso
    //todo inserir parametros de paginação(limit e page), definir o limite máxim da aplicação
    return requestWithToken("get", resource);
}

async function wake( resource, data ){
    //todo: similar a metodo update
    return requestWakeHost( "put", resource, data );
}

async function update(resource, data) {
    //submete autalização de recurso
    return requestWithToken("put", resource, data);
}

async function destroy(resource) {
    //submete remoção de recurso
    return requestWithToken("delete", resource);
}

async function requestWakeHost( method, resource, data = null ){
    //envia mensagem WOL para o host solicitado
    const token = localStorage.getItem("@vagoaminApp:token"); //todo: usar dado do ambiente de configuração
    try {
        const header = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        if (data) {
            header.body = JSON.stringify(data);
            header.headers["Content-Type"] = "application/json; charset=UTF-8";
        }

        const res = await fetch(`${domain}${resource}`, header);

        if (method !== "delete") {
            if (!res.ok) throw new Error(res.statusText);

            const json = await res.json();

            if (json.auth && json.auth === false) throw new Error(json.message);

            return json;
        }
    } catch (error) {
        location.href = "/signin.html";  //todo: usar dado do ambiente de configuração ou página de erro global
    }    
}

async function requestWithToken(method, resource, data = null) {
    //submete chamada a interface REST do servidor
    //Reference: https://restfulapi.net/
    //Sample: https://dev.to/jahangeer/node-js-api-authentication-with-jwt-json-web-token-auth-middleware-ggm

    //Sempre recupera os dados de autenticação atualmente válidos para a sessão
    const token = localStorage.getItem("@vagoaminApp:token"); //todo: usar dado do ambiente de configuração

    try {
        const header = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        if (data) {
            header.body = JSON.stringify(data);
            header.headers["Content-Type"] = "application/json; charset=UTF-8";
        }

        const res = await fetch(`${domain}${resource}`, header);

        if (method !== "delete") {
            if (!res.ok) throw new Error(res.statusText);

            const json = await res.json();

            if (json.auth && json.auth === false) throw new Error(json.message);

            return json;
        }
    } catch (error) {
        location.href = "/signin.html";  //todo: usar dado do ambiente de configuração ou página de erro global
    }
}

// API base de referência https://restfulapi.net/
//const clientapi = { signin, signup, create, read, update, destroy };
//export default clientapi;
const clientapi = { signin, signup, create, read, update, destroy, wake };
export default clientapi;