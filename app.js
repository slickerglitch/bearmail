// app.js
document.getElementById('email-form').addEventListener('submit', async (event) => {
   event.preventDefault();

   const to = document.getElementById('to').value;
   const subject = document.getElementById('subject').value;
   const body = document.getElementById('body').value;

   const response = await fetch('/send', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({ to, subject, text: body }),
   });

   const result = await response.text();
   alert(result);
});

async function loadEmails() {
   const response = await fetch('/receive');
   const emails = await response.json();

   const emailsDiv = document.getElementById('emails');
   emailsDiv.innerHTML = '';

   emails.forEach(email => {
       const emailDiv = document.createElement('div');
       emailDiv.classList.add('email');
       emailDiv.innerHTML = `
           <h3>${email.subject}</h3>
           <p>${email.text}</p>
       `;
       emailsDiv.appendChild(emailDiv);
   });
}

loadEmails();
