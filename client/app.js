const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName;

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));

const login = e => {
	e.preventDefault();
	if (userNameInput.value === '') {
		alert('Please write your name first');
	} else {
		userName = userNameInput.value;
		loginForm.classList.remove('show');
		messagesSection.classList.add('show');
	}
};

const sendMessage = e => {
	e.preventDefault();

	if (messageContentInput.value === '') {
		alert('There is nothing to send');
	} else {
		addMessage(userName, messageContentInput.value);
		socket.emit('message', {
			author: userName,
			content: messageContentInput.value,
		});
		messageContentInput.value = '';
	}
};

const addMessage = (user, msg) => {
	const message = document.createElement('li');
	message.classList.add('message', 'message--received');
	if (user === userName) {
		message.classList.add('message--self');
	}
	message.innerHTML = `
    <h3 class="message__author">${userName === user ? 'You' : user}</h3>
    <div class="message__content">
      ${msg}
    </div>
  `;
	messagesList.appendChild(message);
};

loginForm.addEventListener('submit', e => {
	login(e);
});

addMessageForm.addEventListener('submit', e => {
	sendMessage(e);
});
