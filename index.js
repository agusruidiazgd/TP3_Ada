let datos = [];

const showModalDelete = () =>{
    const modal = document.querySelector('#modal-delete');
    modal.style.display = "flex";
}

const showModal = () => {
    const modal = document.querySelector(".modal-container");
    modal.style.display = "flex";  
}

const closeModal = () => {
    const modals = document.querySelectorAll(".modal-container");
    modals.forEach(modal => modal.style.display = "none")
    //modals.style.display = "none";
}

const eliminarDato = async (dato) =>{
    try{
        const res = await axios.delete(`https://5f7c70d600bd74001690ac5e.mockapi.io/users/${dato.id}`)
        console.log('Usuario eliminado:', dato)
    }catch(err){
        console.log(err);
    }
}

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

    const tEmail = document.createElement('td');
    tEmail.innerText = dato.email; 

    const tAddress = document.createElement('td');
    tAddress.innerText = dato.address;

    const tPhone = document.createElement('td');
    tPhone.innerText = dato.phone;

    const tAction = document.createElement('td'); //TODO: poner icono boton etc !!!!!!!!!!!!

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add("btn-green");
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

const addEmployee = async () => {
    const fullname = document.querySelector("#input-name").value;
    const email = document.querySelector("#input-email").value;
    const address = document.querySelector("#input-address").value;
    const phone = document.querySelector("#input-phone").value;

    if (fullname.length > 50) throw new Error("El máximo de caracteres es 50.");
    if (address.length > 60) throw new Error("El máximo de caracteres es 60.");    
    
    const emailValidator = email.search("@");
    if (emailValidator === -1) throw new Error("El correo debe incluir el caracter @");

    const validPhoneChars = [" ", "-", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const phoneToArray = phone.split("");
    
    phoneToArray.forEach(i => {
        if (validPhoneChars.findIndex(validChar => phoneToArray.includes(validChar)) == false) throw new Error("El número ingresado no tiene formato válido."); 
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
        console.log(newEmployee);
    } catch(err) {
        console.log('ERROR AL CARGAR NEW EMPLOYEE:',err);
    }
}




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

    // document.querySelector('#confirm-delete').addEventListener('click', closeModal);
    // document.querySelector('#cancel-delete').addEventListener('click', closeModal);
}

