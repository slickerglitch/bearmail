// app.js
document.getElementById('login-form').addEventListener('submit', async (event) => {
   event.preventDefault();
 
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
 
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ email, password }),
   });
 
   const data = await response.json();
 
   if (response.ok) {
     localStorage.setItem('token', data.token);
     document.querySelector('.login').style.display = 'none';
     document.querySelector('.compose').style.display = 'block';
     document.querySelector('.inbox').style.display = 'block';
     loadEmails();
   } else {
     alert(data);
   }
 });
 
 async function loadEmails() {
   const token = localStorage.getItem('token');
   const response = await fetch('/receive', {
     headers: {
       'Authorization': `Bearer ${token}`,
     },
   });
 
   const emails = await response.json();
   const emailsDiv = document.getElementById('emails');
   emailsDiv.innerHTML = '';
 
   emails.forEach(email => {
     const emailDiv = document.createElement('div');
     emailDiv.classList.add('email');
     emailDiv.innerHTML = `<h3>${email.subject}</h3><p>${email.text}</p>`;
     emailsDiv.appendChild(emailDiv);
   });
 }
 
 document.getElementById('email-form').addEventListener('submit', async (event) => {
   event.preventDefault();
 
   const token = localStorage.getItem('token');
   const to = document.getElementById('to').value;
   const subject = document.getElementById('subject').value;
   const body = document.getElementById('body').value;
 
   const response = await fetch('/send', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     body: JSON.stringify({ to, subject, text: body }),
   });
 
   const result = await response.text();
   alert(result);
 });
 