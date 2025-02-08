//cohort
const COHORT = "2411-FTB-ET-WEB-PT-cmd";

//API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//console.log(API_URL);

const state = {
  events: [],
};

//GET Request to pull data
const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    state.events = json.data;

    renderAllEvents();
  } catch (error) {
    console.log("Error in fetchAllEvents", error);
  }
};

//POST Request to write new data
const createNewEvent = async (name, location, description, date, time) => {
  try {
    const dateTime = `${date}T${time}`;
    //console.log('12hr time: ' + time);
    //console.log('DateTime: ' + dateTime);
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
        description,
        date: new Date(dateTime).toISOString(),
      }),
    });

    fetchAllEvents();
  } catch (error) {
    console.log("Error in createNewEvent", error);
  }
};

//DELETE Request to remove an event and its set of data
const removeEvent = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchAllEvents();
  } catch (error) {
    console.log("Error in removeEvent", error);
  }
};

//Render Events based on database
const renderAllEvents = () => {
  const eventsContainer = document.getElementById("events-container");
  const eventsList = state.events;

  if (!eventsList || eventsList.length === 0) {
    eventsContainer.innerHTML = "<h3>No events found</h3>";
    return;
  }

  eventsContainer.innerHTML = "";

  //Make event cards based on current data in database
  eventsList.forEach((event) => {
    const eventElement = document.createElement("div");
    const rawDate = new Date(event.date);

    const dateConv = rawDate.toISOString().split("T")[0];
    const timeConv = rawDate.toLocaleTimeString();

    //console.log('Date: ' + dateConv);
    //console.log('Time: ' + timeConv);
    eventElement.classList.add("event-card");
    eventElement.innerHTML = `
      <h4>Event Name: ${event.name}</h4>
      <p>Event Description: ${event.description}</p>
      <p>Event Location: ${event.location}</p>
      <p>Date: ${dateConv}</p>
      <p>Time (Local): ${timeConv}</p>
      <button class="delete-button" data-id="${event.id}">Delete</button>
    `;

    eventsContainer.appendChild(eventElement);

    const deleteButton = eventElement.querySelector(".delete-button");
    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvent(event.target.dataset.id);
      } catch (error) {
        console.log("Error in removeEvent", error);
      }
    });
  });
};

//Add Event Listener to form on click of submit button
//Pulls data in form and calls createNewEvent, then clears out the form values
const addListenerToForm = () => {
  const form = document.querySelector("#new-event-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvent(
      form.name.value,
      form.location.value,
      form.description.value,
      form.date.value,
      form.time.value
    );

    form.name.value = "";
    form.location.value = "";
    form.description.value = "";
    form.date.value = "";
    form.time.value = "";
  });
};

const init = async () => {
  await fetchAllEvents();
  addListenerToForm();
};

init();
