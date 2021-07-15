//const messageForm = document.getElementById('message-form');

const messageForm = $('#message-form')[0];
const nameForm = $('#name-form')[0];
const chatRoom = 'chatroom';
const messageBox = $('#message-box')[0];
const deleteIcon = document.querySelector('.delete');

let room = 'football';
let name = 'anonymous';

const footballArr = [];
const politicsArr = [];
const musicArr = [];
const carArr = [];

console.log($('#nonsense div'));

$('#football').click(()=>{
    room = 'football';
    clearMessageBox();
    footballArr.forEach(message => addMessageToDOM(message));
})

$('#music').click(()=>{
    room = 'music';
    clearMessageBox();
    musicArr.forEach(message => addMessageToDOM(message));
})

$('#car').click(()=>{
    room = 'car';
    clearMessageBox();
    carArr.forEach(message => addMessageToDOM(message));
})

$('#politics').click(()=>{
    room = 'politics';
    clearMessageBox();
    politicsArr.forEach(message => addMessageToDOM(message));
})

$(()=>messageForm.reset());

nameForm.addEventListener('submit',e=>{
    e.preventDefault();
    name = nameForm.name.value;
    nameForm.reset();
})

messageForm.addEventListener('submit',e=>{
    e.preventDefault();
    const message = messageForm.message.value;
    messageForm.reset();
    addToDB(message,name,new Date(),room);
});

messageBox.addEventListener("click", ev => {
    if(ev.target.classList.contains('delete')) deleteMessage(ev.target.parentNode.id);
})

function addToDB(message,sender,created_at,room) {
    const messageObject= {
        message : message,
        date : created_at,
        sender : sender,
        room : room
    };
    db.collection(chatRoom).add(messageObject)
        .then(console.log(`${messageObject.sender} sent a message!`));
}

function clearMessageBox() {
    messageBox.innerHTML = '';
}

function addMessageToDOM(message) {
    const html = `
                    <div id = ${message.id}  >
                        <span><b>${message.data().sender}:</b> ${message.data().message} </span>
                        <i class="fas fa-trash-alt float-right delete mr-1 my-1"></i>
                     </div>
            `;
    messageBox.innerHTML += html;
}

function deleteMessage(id){
    const delMessage = db.collection(chatRoom).doc(id);
    delMessage.delete().then(console.log(`A message from ${delMessage} was deleted!`));
}

const arrOfMessages = document.querySelectorAll('#message-box div');

console.log(arrOfMessages);

function deleteMessageFromDOM(id){
    console.log('fired');
    const arrOfMessages = document.querySelectorAll('#message-box div');
    arrOfMessages.forEach(message=> {
        if(message.id === id) {
            message.remove();
        }
    })
    }




db.collection(chatRoom).onSnapshot(snapshot=> {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                switch (change.doc.data().room) {
                    case 'football' :
                        footballArr.push(change.doc);
                        if(room==='football')addMessageToDOM(change.doc)
                        break;
                    case 'politics' :
                        politicsArr.push(change.doc);
                        if(room==='politics')addMessageToDOM(change.doc)
                        break;
                    case 'music' :
                        musicArr.push(change.doc);
                        if(room==='music') addMessageToDOM(change.doc)
                        break;
                    case 'car' :
                        carArr.push(change.doc);
                        if(room==='car') addMessageToDOM(change.doc)
                }
            }
            else if(change.type==='removed') {
                let index;
                switch (change.doc.data().room) {
                    case 'football' :
                        index = footballArr.indexOf(change.doc);
                        console.log(footballArr,change.doc, index);
                        footballArr.forEach(value => {if(value===change.doc) console.log(888);})
                        footballArr.splice(index,1);
                        break;
                    case 'politics' :
                        index = politicsArr.indexOf(change.doc);
                        politicsArr.splice(index,1);
                        break;
                    case 'music' :
                        index = musicArr.indexOf(change.doc);
                        musicArr.splice(index,1);
                        break;
                    case 'car' :
                        index = carArr.indexOf(change.doc);
                        carArr.splice(index,1);
                }

                deleteMessageFromDOM(change.doc.id);
            }
        })
        /*switch (room) {
            case "football":
                footballArr.forEach(message => addMessageToDOM(message));
                break;
            case "politics":
                politicsArr.forEach(message => addMessageToDOM(message));
                break;
            case "music":
                musicArr.forEach(message => addMessageToDOM(message));
                break;
            case "car":
                carArr.forEach(message => addMessageToDOM(message));
        }*/
    }
);