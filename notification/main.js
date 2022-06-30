//https://developer.mozilla.org/en-US/docs/Web/API/notification
var options = {
  actions: [],
  //badge: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  body: 'body1\nbody2\nbody3\nbody4\nbody5\nbody6\nbody7\nbody8\n',
  icon: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  title: 'Title'
}

function notifyMe() {
  // Let's check if the browser supports notifications
  console.log('notifyMe');
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    console.log('already granted');
    // If it's okay let's create a notification
    var notification = new Notification("Title (already granted)", options);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    console.log('asking again');
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Title (newly granted)", options);
      }
    });
  }

  else {
    console.log('denied');
  }
  setTimeout( () => {
    notifyMe();
  }, 5000);

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}
