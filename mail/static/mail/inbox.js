document.addEventListener('DOMContentLoaded', function() {

  // Toggle between views and display inbox emails
  document.querySelector('#inbox').addEventListener('click', () => {
    load_mailbox('inbox'); inboxes('From', 'sender', 'inbox'), show_archive_button() 
  });

  // Toggle between views and display sent emails
  document.querySelector('#sent').addEventListener('click', () => {
    load_mailbox('sent'); inboxes('To','recipients', 'sent'), hide_archive_button()
  });

  // Toggle between views and display archived emails
  document.querySelector('#archived').addEventListener('click', () => {
    load_mailbox('archive'), inboxes('From', 'sender', 'archive'), show_unarchive_button()
  });

  // Toggle between views and allow user to compose and email
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Once form is submitted, send email
  document.querySelector('#compose-form').onsubmit = send_email;

  // Hide view for individual emails
  document.querySelector('#read-email').style.display = 'none';


  // By default, load the inbox
  load_mailbox('inbox');
});



function inboxes (direction, from, link) {

  // Create main div (HEAD)
  const main_div = document.createElement('div');
  main_div.className = 'list-group';

  // Load sent mailbox
  fetch('/emails/' + link, {method: 'GET'})
  .then(response => response.json())
  .then(datas => {

    datas.forEach((data) => {

    // Create new elements
    const a = document.createElement('div');
    const div = document.createElement('div');
    const h5 = document.createElement('h5');
    const s1 = document.createElement('small');
    const p = document.createElement('p');
    const s2 = document.createElement('small');
  
    // Add classes to elements
    a.className = 'list-group-item list-group-item-action';
    div.className = 'd-flex w-100 justify-content-between';
    h5.className = 'mb-1';
    s1.className = 'text-muted';
    p.className = 'mb-1';
    s2.className = 'text-muted';

    // Append elements
    div.append(h5);
    div.append(s1);
    a.append(div);
    a.append(p);
    a.append(s2);
    main_div.append(a);

    // Append everything to body
    document.querySelector('#emails-view').append(main_div);

    a.id = data["id"];
    h5.innerHTML = `<strong>${direction}: </strong> ${data[from]}`;
    s1.innerHTML = data["timestamp"];
    p.innerHTML = data["subject"];
    s2.innerHTML = data["body"];


    // If inbox emails have been read change to background to grey 
    if (data["read"] == false && direction == 'From') {
      a.className = 'list-group-item list-group-item-action list-group-item-dark';
    }


    // READ SINGLE EMAIL PORTION
    document.getElementById(data["id"]).addEventListener('click', () => {

      // Update email has been read
      fetch('/emails/' + data["id"], {
        method: 'PUT',
        body: JSON.stringify({read: false})
      });
        
      // Hide views not needed
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#read-email').style.display = 'block';
      
      // Get elements from HTML Page
      const bh3 = document.querySelector('#bh3');
      const small = document.querySelector('#small');
      const bh5 = document.querySelector('#bh5');
      const bh4 = document.querySelector('#bh4');

      // Edit Inner HTML and display
      bh3.innerHTML = `<strong>${direction}: </strong> ${data[from]}`;
      small.innerHTML = data["timestamp"];
      bh4.innerHTML = `Subject: ${data["subject"]}`;
      bh5.innerHTML = data["body"];

      // REPLY EMAILS PORTION
      document.querySelector('.btn-primary').addEventListener('click', () => {

        // Change view to compose email
        compose_email();
  
        // Prefill inputs
        document.querySelector('#compose-recipients').value = data["recipients"];
        document.querySelector('#compose-subject').value = `Re: ${data["subject"]}`;
        document.querySelector('#compose-body').value = `On ${data["timestamp"]} ${data["recipients"]} wrote: `; 
        
      });


      // ARCHIVE EMAILS PORTION

      // If archived button is clicked
      document.querySelector('.btn-outline-dark').addEventListener('click', () => {

        fetch('emails/' + data["id"], {
          method: 'PUT',
          body: JSON.stringify({archived: true})
        })

        load_mailbox('inbox')
      });

      // If unarchived button is clicked
      document.querySelector('.btn-outline-secondary').addEventListener('click', () => {

        fetch('emails/' + data["id"], {
          method: 'PUT',
          body: JSON.stringify({archived: false})
        })

        load_mailbox('inbox')
      });


    
      });
    
    });
    
  }); 

};


function hide_archive_button () {
  // Hide archive button for inbox emails
  document.querySelector('.btn-outline-dark').style.display = 'none';
  document.querySelector('.btn-primary').style.display = 'none';
  document.querySelector('.btn-outline-secondary').style.display = 'none';
}

function show_unarchive_button () {
  // Show unarchive button for inbox emails
  document.querySelector('.btn-outline-secondary').style.display = 'block';
  document.querySelector('.btn-outline-dark').style.display = 'none';
  document.querySelector('.btn-primary').style.display = 'none';
}

function show_archive_button () {
  // Show archive button for inbox emails
  document.querySelector('.btn-outline-dark').style.display = 'block';
  document.querySelector('.btn-outline-secondary').style.display = 'none';
  document.querySelector('.btn-primary').style.display = 'block';  

}

function send_email() {
  // Get sent email data
  const recipients = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const body = document.querySelector('#compose-body').value

  // Post method to send to database
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({recipients: recipients, subject: subject, body: body})
  })
  .then(response => response.json())
  .then(result => {
    console.log(result)
  });
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-email').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

