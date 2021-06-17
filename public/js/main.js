import clientapi from "/js/rest/clientapi.js";

window.addEventListener("DOMContentLoaded", (event) => {
    //Durante a carga do documento atual, verifica se existe autenticação previa e redireciona se necessário
    var accessTokenObj = localStorage.getItem("@vagoaminApp:token");
    if (!accessTokenObj) {
        location.href = "/signin.html";
        window.redirect("signin.html");
    }
});

//bindcontrols
var globalUnitID = -1;
const globalUnitList = document.querySelector("#unitList");
const globalHostList = document.querySelector("#hostList");
const globalAlwaysOnList = document.querySelector("#hostList");
const globalLblUser = document.getElementById("user-lbl");
const globalStyleList = document.getElementById("user-css");
const globallblAdmUserLogin = document.getElementById( "lblAdmUserLogin")

//script para eventos
async function dlgDeleteUnit() {
    debugger;
    if (globalUnitID >= 0) {
        const itemName =
            globalUnitList.options[globalUnitList.selectedIndex].innerHTML;
        if (confirm(`Confirma a remoção da unidade(${itemName})?`)) {
            const ret = await clientapi.destroy(`/units/${globalUnitID}`);
            globalUnitList.options[globalUnitList.selectedIndex].remove();
            globalUnitID = -1;
        }
    } else {
        alert("Selecione a unidade para realizar a operação");
    }
}

globalUnitList.addEventListener("change", (event) => {
    //talvez seja necessario adiantar a alteração do item selecionado
    //1 - remove do atual $(".list-group .list-group-item").removeClass("active");
    //2  passa para o novo $(e.target).addClass("active");
    const selOpt = event.target.options[event.target.selectedIndex];
    const key = selOpt.getAttribute("unit-id");
    const admLogin = selOpt.getAttribute( "unit-adm-login" );
    if (key) {
        globalUnitID = key;
        globallblAdmUserLogin.innerHTML = `Adm. por: ${admLogin}`;
        loadHostList(key);
    } else {
        globalUnitID = -1;
        alert("Chave inválida");
    }
});

async function signout() {
    await fetch("/signout");
    localStorage.removeItem("@vagoaminApp:token");
    localStorage.removeItem("@vagoaminApp:user");
    location.href = "/signin.html";
}

function insertHostItem(ctl, host) {
    const hostItem = `<option id="${host.id}">${host.name}</option>`;
    ctl.insertAdjacentHTML("beforeend", hostItem);
}

function loadFormValues(title, unitName, unitAdm, unitMaxOn) {
    const formLabel = document.querySelector("#formUnitLabel");
    const unitNameInput = document.querySelector("#unit-name");
    const unitAdmSelect = document.querySelector("#unit-admId");
    const unitMaxSelect = document.querySelector("#unit-max_on");

    formLabel.innerHTML = title;
    unitNameInput.value = unitName;
    unitMaxSelect.selectedIndex = unitMaxOn-1; //base 0
    Array.from(unitAdmSelect.options).forEach((option, index) => {
        if (option.innerHTML === unitAdm) unitAdmSelect.value = index + 1;
    });
}

function insertUserItem(ctl, user, admId) {
    if (admId == user.id) {
        var userItem = `<option value="${user.id}" selected>${user.login}</option>`;
    } else {
        var userItem = `<option value="${user.id}">${user.login}</option>`;
    }
    ctl.insertAdjacentHTML("beforeend", userItem);
}

async function loadHostList(key) {
    const hlist = document.getElementById("hostList");
    hlist.innerHTML = "";
    //todo validar agora
    const hosts = await clientapi.read(`/hosts/unit/${key}`);
    for (const host of hosts) {
        insertHostItem(hlist, host);
    }
}

function createUnitView(newUnit) {
    const unitView = document.getElementById("unitList");
    unitView.insertAdjacentHTML(
        "beforeend",
        `<option id="${newUnit.id}"> ${newUnit.name}</option>`
    );
}

async function dlgEditNewUnit() {
    const formUnit = document.querySelector("#formUnit");
    //carga dos usuários para lista de adms
    var users = await clientapi.read(`/users`);
    const ctl = formUnit.querySelector("#unit-admId");
    ctl.innerHTML = "";
    for (const user of users) {
        insertUserItem(ctl, user);
    }
    loadFormValues("Criação de unidade", "", "");
    formUnit.onsubmit = async (e) => {
        e.preventDefault();
        let unit = Object.fromEntries(new FormData(formUnit));
        //HACK recupera id pelo login
        unit.admId = users.find((o) => o.login === unit.admId).id; //reverso para pegar o id pelo login
        try {
            var newUnit = await clientapi.create("/units", unit);
        } catch (err) {
            alert(`Falha salvando nova unidade: ${err}`);
        }
        createUnitView(newUnit); //insere entrada na lista de unidades
        $("#formUnitModal").modal("toggle");
        document.querySelector("#createUnitBtn").blur();
    };
}

async function dlgUpdateUnit() {
    const formUnit = document.querySelector("#formUnit");
    try {
        var unit = await clientapi.read(`/units/${globalUnitID}`);
    } catch (err) {
        alert(`Erro recuperado os dados( ${err} )`);
    }
    const ctlMaxOn = formUnit.querySelector("#unit-max_on");
    ctlMaxOn.selectedIndex=unit.max_on-1;
    const users = await clientapi.read(`/users`);
    const ctl = formUnit.querySelector("#unit-admId");
    ctl.innerHTML = "";
    for (const user of users) {
        insertUserItem(ctl, user, unit.adm_id);
    }
    loadFormValues("Editar unidade", unit.name, unit.admId, unit.max_on);
    formUnit.onsubmit = (e) => {
        e.preventDefault();
        const unit = Object.fromEntries(new FormData(formUnit));
        const optValue = ctlMaxOn.options[ ctlMaxOn.selectedIndex ].getAttribute("value");
        unit.admId = optValue; //reverso para pegar o id pelo login
        clientapi.update(`/units/${globalUnitID}`, unit);
        updateUnitView(unit);
        $("#formUnitModal").modal("toggle");
    };
}

function updateUnitView(unit) {
    const item = globalUnitList.options[globalUnitList.selectedIndex];
    item.innerHTML = unit.name;
}

function dlgPowerHost() {
    alert(
        `Serviço Wake-on-LAN(WOL) será acionado para o host informado através de seu MAC addres`
    );
}

//troca de estilos
document.getElementById("user-css").addEventListener("change", (event) => {
    //args = (cssFile, cssLinkIndex)
    const cssFile = Array.from(["/css/claro.css", "/css/escuro.css"])[
        globalStyleList.options.selectedIndex
    ];
    //cssLinkIndex)
    var oldlink = document.getElementById("dynamic-css"); //.item(cssLinkIndex);
    oldlink.setAttribute("href", cssFile);
});

window.dlgPowerHost = dlgPowerHost;
window.dlgDeleteUnit = dlgDeleteUnit;

window.dlgEditNewUnit = dlgEditNewUnit;
window.dlgUpdateUnit = dlgUpdateUnit;
window.signout = signout;

window.onload = function (e) {
    globalLblUser.innerHTML = localStorage.getItem("@vagoaminApp:user");
};

const init = function () {};
