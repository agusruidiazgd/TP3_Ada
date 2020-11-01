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
        document.querySelector("#add-button").innerText = "Save";
        editarFila();
        isEditModal = false;
    }
    else {
        document.querySelector("#title-modal").innerText = "Add new employee";
        document.querySelector("#add-button").innerText = "Add";
    }
    modal.style.display = "flex";  
}

const closeModal = () => {
    const modals = document.querySelectorAll(".modal-container");
    modals.forEach(modal => modal.style.display = "none")
}


//*****************************************//
////////FUNCIONES PARA LIMPIAR INPUTS////////
//*****************************************//

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
///////FUNCIONES PARA CARGAR DATOS API////////
//******************************************//

const crearFila = (dato) =>{
    const tbody = document.querySelector(`#tbody`);
    
    const trow = document.createElement("tr");
    trow.className = 'tr-style'; // TODO: estilar tr-style !!!!!!!!!!!!!!!!!!!!!!!!!!
    trow.id = `user-${dato.id}`;
    const tCheckbox = document.createElement('td');
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
            document.querySelector('#input-address').innerText = dato.address;
            document.querySelector('#input-phone').value = dato.phone;

            //RENOMBRAR ADD BUTTON EN HTML Y TODAS LAS OTRAS
            document.querySelector('#add-button').addEventListener('click', (e) => {

                /*let el = document.querySelector("#miId")
                el.addEventListener("keyup", (event) => { // keypress, keydown
                    console.log(event.target == el);
                }); */           
            //////PENDIENTE /////
            console.log(e);
            editarFila(dato.id);//saco del html
            editarDato(dato);//editar info de la api REVISARRR!!
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
const editarFila = (idUser) => {
    //alert(idUser);
    //let newName = document.querySelector('#name-${idUser}')
    //newName.innerText = document.querySelector('#input-name').value
    


    //const phone = `phone-${dato.id}`;
    //alert(phone);
    //const user = document.querySelector(`#user-${idUser}`);
    //const userArray = user.childNodes;
    //userArray[1].style.backgroundColor = "yellow";
    //console.log(userAEditar);
    // AGREGAR ACA LA FUNCION EDIT!    
/*
    tEmail.id = `email-${dato.id}`;
    tAddress.id = `address-${dato.id}`;
    tPhone.id = `phone-${dato.id}`;*/
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

////PENDIENTE////
//revisar estilo textarea que queda azul después de ingresado un dato
//revisar finally después de error, no se limpian los inputs

const addEmployee = async () => {
    const fullname = document.querySelector("#input-name").value;
    const email = document.querySelector("#input-email").value;
    const address = document.querySelector("#input-address").value;
    const phone = document.querySelector("#input-phone").value;

    if (fullname.length > 50) throw new Error("El máximo de caracteres es 50.");
    if (address.length > 60) throw new Error("El máximo de caracteres es 60.");    
    
    const emailValidator = email.search("@");
    if (emailValidator === -1) throw new Error("El correo debe incluir el caracter @");

    const validPhoneChars = [" ", "-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const phoneToArray = phone.split("");

    phoneToArray.forEach(i => {
        if (validPhoneChars.indexOf(i) == -1) throw new Error("El número ingresado no tiene formato válido.");
    });

    try {
        const postData = {
            fullname,
            phone,
            email,
            address
        };
        const res = await axios.post("https://5f7c70d600bd74001690ac5e.mockapi.io/users", postData);
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

    const addEmployeeButton = document.querySelector('#add-employee-button'); 
    addEmployeeButton.addEventListener("click", () => showModal());

    const addButton = document.querySelector('#add-button'); 
    addButton.addEventListener("click", () => addEmployee());

    const closeButtons = document.querySelectorAll('.close'); 
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => closeModal());
    })
}

