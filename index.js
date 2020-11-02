////PENDIENTE////
//revisar estilo textarea que queda azul después de ingresado un dato
//revisar outlines inputs modales segun mockup (no tiene)
//metemos la animación de mora en el delete?
//boton cancel no borra datos pero si lo ponemos en close modal rompe!

let datos = [];

//*****************************************//
/////FUNCIONES PARA ABRIR/CERRAR MODALS//////
//*****************************************//

const showModalDelete = () =>{
    const modal = document.querySelector('#modal-delete');
    modal.style.display = "flex";
}

let isEditModal = false

const showModal = () => {

    const modal = document.querySelector(".modal-container");
    if (isEditModal) {
        document.querySelector("#title-modal").innerText = "Edit user";
        document.querySelector("#add-button").style.display = "none";
        document.querySelector("#edit-button").style.display = "inline-block";
    
        isEditModal = false;
    }
    else {
        document.querySelector("#title-modal").innerText = "Add new employee";
        document.querySelector("#edit-button").style.display = "none";
        document.querySelector("#add-button").style.display = "inline-block";
    }
    modal.style.display = "flex";  
}

const closeModal = () => {
    const modals = document.querySelectorAll(".modal-container");
    modals.forEach(modal => modal.style.display = "none");
    //clearInputs();
}


//*****************************************//
////////////FUNCIONES AUXILIARES/////////////
//*****************************************//

const inputValidator = () => {
    const fullname = document.querySelector("#input-name").value;
    const email = document.querySelector("#input-email").value;
    const address = document.querySelector("#input-address").value;
    const phone = document.querySelector("#input-phone").value;


    const emailValidator = email.search("@");
    const validPhoneChars = [" ", "-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const phoneToArray = phone.split("");

    if (fullname.length > 50) throw new Error("El máximo de caracteres es 50.");
        if (address.length > 60) throw new Error("El máximo de caracteres es 60."); 
        if (emailValidator === -1) throw new Error("El correo debe incluir el caracter @");
        phoneToArray.forEach(i => {
            if (validPhoneChars.indexOf(i) == -1) throw new Error("El número ingresado no tiene formato válido.");
        });

    const data = {
        fullname,
        phone,
        email,
        address
    };
    return data;
}

const clearInputs = () => {
    document.querySelector("#input-name").value = ""; 
    document.querySelector("#input-email").value = "";
    document.querySelector("#input-address").value = "";
    document.querySelector("#input-phone").value = "";
}

//*****************************************//
////////FUNCIONES PARA ELIMINAR DATOS////////
//*****************************************//

const eliminarDato = async (dato) =>{
    try{
        const res = await axios.delete(`https://5f7c70d600bd74001690ac5e.mockapi.io/users/${dato.id}`)
        console.log('Usuario eliminado:', dato)
    }catch(err){
        console.log(err);
    }
}

const eliminarFila = (idUser) => {
    const userAeliminar = document.querySelector(`#user-${idUser}`);
    userAeliminar.remove();
}

const eliminarTodasLasFilas = (fila) =>{
    let list = document.querySelectorAll(fila);
    for(let i of list){
        i.remove();
    }
}

//******************************************//
///////FUNCIONES PARA LEVANTAR DATOS API//////
//******************************************//

const crearFila = (dato) =>{
    const tbody = document.querySelector(`#tbody`);
    
    const trow = document.createElement("tr");
    trow.className = 'tr-style';
    trow.id = `user-${dato.id}`;
    const tCheckbox = document.createElement('td');
    tCheckbox.style.paddingLeft = "20px"

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';    

    const tName = document.createElement('td');
    tName.innerText = dato.fullname; 
    tName.id = `name-${dato.id}`;

    const tEmail = document.createElement('td');
    tEmail.innerText = dato.email; 
    tEmail.id = `email-${dato.id}`;

    const tAddress = document.createElement('td');
    tAddress.innerText = dato.address;
    tAddress.id = `address-${dato.id}`;

    const tPhone = document.createElement('td');
    tPhone.innerText = dato.phone;
    tPhone.id = `phone-${dato.id}`;

    const tAction = document.createElement('td'); //TODO: poner icono boton etc !!!!!!!!!!!!

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add("btn-green");
    buttonEdit.classList.add("btn-edit");
    buttonEdit.addEventListener("click", () => {
            isEditModal = true;
            showModal();
            document.querySelector('#input-name').value = dato.fullname;
            document.querySelector('#input-email').value = dato.email;
            document.querySelector('#input-address').value = dato.address;
            document.querySelector('#input-phone').value = dato.phone;

            document.querySelector('#edit-button').addEventListener('click', () => {
                editEmployee(dato.id);
            })
        } 
    );
    
    const iEdit = document.createElement('i');
    iEdit.innerHTML = "&#xE254;";
    iEdit.classList.add("material-icons");
    iEdit.title="Edit";  

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add("btn-red");
    const iDelete = document.createElement('i');
    iDelete.innerHTML = "&#xE872;";
    iDelete.classList.add("material-icons");
    iDelete.title="Delete";

    buttonDelete.addEventListener("click", () => {
        showModalDelete();

        document.querySelector('#delete-name').innerText = dato.fullname;
        document.querySelector('#delete-email').innerText = dato.email;
        document.querySelector('#delete-address').innerText = dato.address;
        document.querySelector('#delete-phone').innerText = dato.phone;
        
        document.querySelector('#confirm-delete').addEventListener('click', ()=>{
            eliminarFila(dato.id);//saco del html
            eliminarDato(dato);//elimino info de la api
            closeModal();
        })

        document.querySelector('#cancel-delete').addEventListener('click', closeModal);        
    });

    buttonEdit.appendChild(iEdit);
    tAction.appendChild(buttonEdit);
    buttonDelete.appendChild(iDelete);
    tAction.appendChild(buttonDelete);

    tCheckbox.appendChild(checkbox);
    trow.appendChild(tCheckbox);
    trow.appendChild(tName);
    trow.appendChild(tEmail);
    trow.appendChild(tAddress);
    trow.appendChild(tPhone);
    trow.appendChild(tAction);
    tbody.appendChild(trow);

}

const cargarDatos = async () =>{
    try{
        const res = await axios.get('https://5f7c70d600bd74001690ac5e.mockapi.io/users')
        datos = res.data;
        datos.map( dato =>{
            crearFila(dato);
        })
    }catch(err){
        console.log('ERROR:',err);
    }
}

//******************************************//
///////FUNCIONES PARA EDITAR DATOS////////////
//******************************************//
const editEmployee = async (idUser) => {

    try {
        const data = inputValidator();

        let tdName = document.querySelector(`#name-${idUser}`);
        tdName.innerText = data.fullname;
    
        let tdEmail = document.querySelector(`#email-${idUser}`);
        tdEmail.innerText = data.email;
    
        let tdAddress = document.querySelector(`#address-${idUser}`);
        tdAddress.innerText = data.address;
    
        let tdPhone = document.querySelector(`#phone-${idUser}`);
        tdPhone.innerText = data.phone;

        const res = await axios.put(`https://5f7c70d600bd74001690ac5e.mockapi.io/users/${idUser}`, data);
        console.log(res);
    } 
    catch(err) {
        console.log('ERROR AL EDITAR EMPLOYEE:',err);
    } 
    finally {
        clearInputs();
    }
}

//******************************************//
///////FUNCIONES PARA FILTRAR DATOS///////////
//******************************************//

const filtrarDatos = async (searchParam) =>{
    try{
        const res = await axios.get(`https://5f7c70d600bd74001690ac5e.mockapi.io/users/?search=${searchParam}`);
        eliminarTodasLasFilas('.tr-style');
        datos = res.data;
        console.log(datos);
        datos.map( dato =>{
            crearFila(dato);
        })
    }catch(err){
        console.log("ERROR AL FILTRAR DATOS:", err);
    }
}

const filtrarUsuarios = () =>{
    const searchParam = document.querySelector("#input-filter-user").value.toLowerCase();
    console.log(searchParam);
    if(searchParam.length == 0) {
        eliminarTodasLasFilas('.tr-style');
        cargarDatos();
    }
    if(searchParam.length < 3) return; 
    filtrarDatos(searchParam);
}

//******************************************//
/////FUNCIONES PARA AGREGAR NUEVOS DATOS//////
//******************************************//

const addEmployee = async () => {
    try {
        const data = inputValidator();
        const res = await axios.post("https://5f7c70d600bd74001690ac5e.mockapi.io/users", data);
        const newEmployee = res.data;
        crearFila(newEmployee);
    } 
    catch(err) {
        console.log('ERROR AL CARGAR NEW EMPLOYEE:',err);
    } 
    finally {
        clearInputs();
    }
}

//******************************************//
////////////ONLOAD + EVENT LISTENERS//////////
//******************************************//

const onLoad = () => {
    cargarDatos();

    document.querySelector("#btn-filter-user").addEventListener("click",filtrarUsuarios);

    const addButton = document.querySelector('#add-button'); 
    addButton.addEventListener("click", () => addEmployee());

    const addEmployeeButton = document.querySelector('#add-employee-button'); 
    addEmployeeButton.addEventListener("click", () => showModal());

    const closeButtons = document.querySelectorAll('.close'); 
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => closeModal());
    })
}

